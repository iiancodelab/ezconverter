'use client';

import { useCallback, useState, memo } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

// Validation function outside component to prevent recreation
const validateFile = (file: File): boolean => {
  if (!file.name || file.name.trim() === '' || file.name === 'file') {
    alert('Please select a file with a proper name and extension.');
    return false;
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension) {
    alert('Please select a file with a valid extension.');
    return false;
  }
  
  return true;
};

function FileUploaderComponent({ onFileSelect, selectedFile }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        onFileSelect(file);
      } else {
        e.target.value = ''; // Clear the input
      }
    }
  }, [onFileSelect]);

  return (
    <Card className="p-8">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center
            transition-colors cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.docx,.xlsx,.csv,.pptx"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Drop your file here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-sm text-gray-500">
              PDF, Word, Excel, CSV, PowerPoint (Max 10MB)
            </p>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFileSelect(null)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const FileUploader = memo(FileUploaderComponent);