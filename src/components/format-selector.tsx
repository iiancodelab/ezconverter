'use client';

import { memo } from 'react';
import { FileFormat, FORMAT_LABELS } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormatSelectorProps {
  selectedFormat: FileFormat | null;
  onFormatChange: (format: FileFormat) => void;
  disabled?: boolean;
  currentFileFormat?: string;
}

function FormatSelectorComponent({
  selectedFormat,
  onFormatChange,
  disabled,
  currentFileFormat,
}: FormatSelectorProps) {
  return (
    <Select
      value={selectedFormat || undefined}
      onValueChange={(value) => onFormatChange(value as FileFormat)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select output format" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(FORMAT_LABELS).map(([key, label]) => {
          const isCurrentFormat = key === currentFileFormat;
          return (
            <SelectItem 
              key={key} 
              value={key}
              disabled={isCurrentFormat}
            >
              {label} {isCurrentFormat && '(Current format)'}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// Memoize to prevent unnecessary re-renders when parent state changes
export const FormatSelector = memo(FormatSelectorComponent);