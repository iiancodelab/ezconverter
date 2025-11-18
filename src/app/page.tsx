'use client';

import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { FileUploader } from '@/components/file-uploader';
import { FormatSelector } from '@/components/format-selector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileFormat } from '@/lib/types';
import { Download, Loader2 } from 'lucide-react';

// Lazy load heavy components
const Progress = lazy(() => import('@/components/ui/progress').then(module => ({ default: module.Progress })));

// Loading fallback component
const ProgressLoader = () => (
  <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
);

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<FileFormat | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    if (!file || !outputFormat) return;

    // Check if same format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === outputFormat) {
      toast.error('Input and output formats are the same. Please choose a different format.');
      return;
    }

    // Show warning for potentially challenging conversions
    if (fileExtension === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(outputFormat)) {
      toast.info('PDF conversions work best with text-based PDFs. Scanned PDFs may have limited results.');
    }

    setIsConverting(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', outputFormat);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      setDownloadUrl(data.downloadUrl);
      toast.success('File converted successfully!');

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsConverting(false);
    }
  }, [file, outputFormat]);

  const fileExtension = useMemo(() => {
    return file ? file.name.split('.').pop()?.toLowerCase() || '' : '';
  }, [file]);

  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
      // Reset after download
      setTimeout(() => {
        setFile(null);
        setOutputFormat(null);
        setDownloadUrl(null);
      }, 1000);
    }
  }, [downloadUrl]);

  const handleReset = useCallback(() => {
    setFile(null);
    setOutputFormat(null);
    setDownloadUrl(null);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Converter
          </h1>
          <p className="text-gray-600">
            Convert PDF, Word, Excel, CSV, and PowerPoint files easily
          </p>
        </div>

        {/* Main Card */}
        <div className="space-y-6">
          {/* Step 1: Upload */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-700">
              Step 1: Upload your file
            </h3>
            <FileUploader onFileSelect={setFile} selectedFile={file} />
          </div>

          {/* Step 2: Select Format */}
          {file && (
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-700">
                Step 2: Choose output format
              </h3>
              <FormatSelector
                selectedFormat={outputFormat}
                onFormatChange={setOutputFormat}
                disabled={isConverting}
                currentFileFormat={fileExtension || undefined}
              />
            </div>
          )}

          {/* Step 3: Convert */}
          {file && outputFormat && !downloadUrl && (
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert File'
              )}
            </Button>
          )}

          {/* Progress */}
          {isConverting && (
            <div className="space-y-2">
              <Suspense fallback={<ProgressLoader />}>
                <Progress value={undefined} className="h-2" />
              </Suspense>
              <p className="text-sm text-center text-gray-500">
                Please wait while we convert your file...
              </p>
            </div>
          )}

          {/* Download */}
          {downloadUrl && (
            <div className="space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Converted File
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Convert Another File
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Secure and private • Files are deleted after conversion</p>
          <div className="mt-2">
            <a 
              href="/docs" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              API Documentation
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
