import { NextRequest, NextResponse } from 'next/server';
import { convertFile } from '@/lib/cloudconvert';

// Cache supported formats to avoid recreation
const SUPPORTED_FORMATS = ['pdf', 'docx', 'xlsx', 'csv', 'pptx'] as const;

const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/csv',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Also support some common alternatives
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
] as const;

// Cache max file size
const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
const MAX_FILE_SIZE_MB = Math.round(MAX_FILE_SIZE / 1024 / 1024);

function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB` 
    };
  }

  // Check file extension
  const extension = getFileExtension(file.name);
  if (!SUPPORTED_FORMATS.includes(extension as any)) {
    return {
      valid: false,
      error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
    };
  }

  // Check MIME type if available (optional warning)
  if (file.type && !SUPPORTED_MIME_TYPES.includes(file.type as any)) {
    console.warn(`Unknown MIME type: ${file.type} for file: ${file.name}`);
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const outputFormat = formData.get('outputFormat') as string;

    // Validate file presence and properties
    if (!file || !file.name || file.name.trim() === '') {
      return NextResponse.json(
        { error: 'No valid file provided or file has no name' },
        { status: 400 }
      );
    }

    // Check if file is actually a File object with content
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      );
    }

    // Validate output format
    if (!outputFormat || !SUPPORTED_FORMATS.includes(outputFormat as any)) {
      return NextResponse.json(
        { error: `Invalid output format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if conversion is needed (same format)
    const inputExtension = getFileExtension(file.name);
    if (inputExtension === outputFormat) {
      return NextResponse.json(
        { error: 'Input and output formats are the same. No conversion needed.' },
        { status: 400 }
      );
    }

    // Convert file
    const downloadUrl = await convertFile(file, outputFormat);

    return NextResponse.json({
      success: true,
      downloadUrl,
      originalFilename: file.name,
      outputFormat,
    });

  } catch (error: any) {
    console.error('Conversion failed:', error.message);
    
    // Return appropriate error message
    const errorMessage = error.message || 'Conversion failed';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}