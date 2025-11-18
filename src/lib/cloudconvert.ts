import CloudConvert from 'cloudconvert';

if (!process.env.CLOUDCONVERT_API_KEY) {
  throw new Error('CLOUDCONVERT_API_KEY is not set');
}

export const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

// Get appropriate conversion options based on input and output formats
function getConversionOptions(inputFormat: string, outputFormat: string) {
  const options: any = {};

  // PDF conversions
  if (inputFormat === 'pdf') {
    if (outputFormat === 'docx' || outputFormat === 'xlsx' || outputFormat === 'pptx') {
      // PDF to Office formats - use default engine (no engine specified)
      // CloudConvert automatically chooses the best engine for PDF conversions
    } else if (outputFormat === 'csv') {
      // PDF to CSV might need OCR
      options.ocr_engine = 'tesseract';
    }
  }
  
  // Office formats to PDF
  else if (['docx', 'xlsx', 'pptx'].includes(inputFormat) && outputFormat === 'pdf') {
    options.engine = 'office';
    options.optimize_print = true;
  }
  
  // Office format to office format
  else if (['docx', 'xlsx', 'pptx'].includes(inputFormat) && ['docx', 'xlsx', 'pptx'].includes(outputFormat)) {
    options.engine = 'office';
  }
  
  // CSV conversions
  else if (inputFormat === 'csv') {
    if (outputFormat === 'xlsx') {
      options.engine = 'office';
    } else if (outputFormat === 'pdf') {
      options.engine = 'office';
      options.optimize_print = true;
    }
  }
  
  // To CSV conversions
  else if (outputFormat === 'csv') {
    if (['xlsx', 'docx', 'pptx'].includes(inputFormat)) {
      options.engine = 'office';
    }
  }

  return options;
}

export async function convertFile(
  file: File,
  outputFormat: string
): Promise<string> {
  try {
    // Validate file has a proper name
    if (!file.name || file.name.trim() === '' || file.name === 'file') {
      throw new Error('Invalid file name. Please ensure your file has a proper name with extension.');
    }

    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const uniqueFileName = `${baseName}_${timestamp}.${extension}`;

    // Step 1: Create a job using REST API directly
    const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDCONVERT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: {
          'import-file': {
            operation: 'import/upload',
          },
          'convert-file': {
            operation: 'convert',
            input: 'import-file',
            output_format: outputFormat,
            // Use appropriate engines based on input and output formats
            ...getConversionOptions(extension, outputFormat),
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file',
            inline: false,
          },
        },
        tag: `file-converter-${timestamp}`,
      }),
    });

    if (!jobResponse.ok) {
      const errorData = await jobResponse.text();
      throw new Error(`Failed to create job: ${jobResponse.status} ${errorData}`);
    }

    const job = await jobResponse.json();

    // Step 2: Find the upload task
    const uploadTask = job.data.tasks.find((task: any) => task.operation === 'import/upload');
    if (!uploadTask) {
      throw new Error('Upload task not found in job');
    }

    // Step 3: Upload the file using the upload form
    const uploadFormData = new FormData();
    
    // Add all form parameters first
    Object.entries(uploadTask.result.form.parameters).forEach(([key, value]) => {
      uploadFormData.append(key, value as string);
    });
    
    // Add the file with the correct filename as the last field
    uploadFormData.append('file', file, uniqueFileName);
    
    const uploadResponse = await fetch(uploadTask.result.form.url, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.text();
      console.error('Upload response:', uploadError);
      throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    // Step 4: Wait for job completion
    let jobStatus = 'waiting';
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    while (jobStatus !== 'finished' && jobStatus !== 'error' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDCONVERT_API_KEY}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check job status: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      jobStatus = statusData.data.status;
      attempts++;
    }

    if (jobStatus === 'error') {
      // Get the final job details to see what went wrong
      const finalJobResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}?include=tasks`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDCONVERT_API_KEY}`,
        },
      });
      
      const finalJob = await finalJobResponse.json();
      const errorTasks = finalJob.data.tasks.filter((task: any) => task.status === 'error');
      const errorMessages = errorTasks.map((task: any) => {
        const message = task.message || task.result?.error || 'Unknown error';
        return `Task ${task.name}: ${message}`;
      });
      
      throw new Error(`Conversion failed: ${errorMessages.join(', ')}`);
    }

    if (jobStatus !== 'finished') {
      throw new Error('Job did not complete within the expected time');
    }

    // Step 5: Get the download URL
    const finalJobResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}?include=tasks`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDCONVERT_API_KEY}`,
      },
    });
    
    const finalJob = await finalJobResponse.json();
    const exportTask = finalJob.data.tasks.find((task: any) => 
      task.operation === 'export/url' && task.status === 'finished'
    );

    if (!exportTask) {
      throw new Error('Export task not found or not completed');
    }

    const downloadUrl = exportTask.result?.files?.[0]?.url;
    
    if (!downloadUrl) {
      throw new Error('Download URL not found in export result');
    }

    return downloadUrl;

  } catch (error: any) {
    console.error('CloudConvert conversion failed:', error.message);
    
    // Provide more specific error messages
    if (error.message?.includes('insufficient_credits')) {
      throw new Error('CloudConvert credits exhausted. Please check your account.');
    }
    
    if (error.message?.includes('invalid_file_format')) {
      throw new Error('Invalid file format. Please check the input file.');
    }
    
    if (error.message?.includes('file_too_large')) {
      throw new Error('File is too large for conversion.');
    }

    if (error.message?.includes('Invalid filename')) {
      throw new Error('Invalid file name. Please ensure your file has a proper name with extension.');
    }

    if (error.message?.includes('conversion type is not supported')) {
      const inputExt = file.name.split('.').pop()?.toLowerCase();
      throw new Error(`Conversion from ${inputExt?.toUpperCase()} to ${outputFormat.toUpperCase()} is not supported by CloudConvert. Please try a different format combination.`);
    }

    if (error.message?.includes('OCR')) {
      throw new Error('OCR processing failed. The PDF might be too complex or contain unsupported elements.');
    }

    throw new Error(`Conversion failed: ${error.message || 'Unknown error'}`);
  }
}