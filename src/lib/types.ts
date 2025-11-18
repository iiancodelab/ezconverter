export type FileFormat = 'pdf' | 'docx' | 'xlsx' | 'csv' | 'pptx';

export interface ConversionJob {
  id: string;
  status: 'waiting' | 'processing' | 'finished' | 'error';
  inputFile: File;
  outputFormat: FileFormat;
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export const FORMAT_LABELS: Record<FileFormat, string> = {
  pdf: 'PDF',
  docx: 'Word Document',
  xlsx: 'Excel Spreadsheet',
  csv: 'CSV',
  pptx: 'PowerPoint',
};

export const MIME_TYPES: Record<FileFormat, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

// Define conversion capabilities
export const CONVERSION_NOTES: Record<string, Record<string, string>> = {
  pdf: {
    docx: 'PDF to Word conversion works best with text-based PDFs',
    xlsx: 'PDF to Excel requires tables to be properly structured',
    csv: 'PDF to CSV works best with tabular data',
    pptx: 'PDF to PowerPoint conversion has limited support'
  },
  docx: {
    pdf: 'Word to PDF conversion preserves formatting',
    xlsx: 'Word to Excel extracts tables and data',
    csv: 'Word to CSV extracts tabular content',
    pptx: 'Word to PowerPoint conversion available'
  },
  xlsx: {
    pdf: 'Excel to PDF preserves formatting and layout',
    docx: 'Excel to Word creates tables and content',
    csv: 'Excel to CSV exports data without formatting',
    pptx: 'Excel to PowerPoint creates charts and tables'
  },
  csv: {
    pdf: 'CSV to PDF creates formatted tables',
    docx: 'CSV to Word creates structured tables',
    xlsx: 'CSV to Excel imports data with formatting',
    pptx: 'CSV to PowerPoint creates data presentations'
  },
  pptx: {
    pdf: 'PowerPoint to PDF preserves slides and formatting',
    docx: 'PowerPoint to Word extracts text content',
    xlsx: 'PowerPoint to Excel extracts data and charts',
    csv: 'PowerPoint to CSV extracts tabular data'
  }
};