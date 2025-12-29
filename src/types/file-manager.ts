export interface FileTag {
  tag: string;
  // Add other tag properties if available, e.g., id: string;
}

export interface FileItem {
  file_id: string;
  filename: string;
  file_size: number; // in bytes
  upload_time: string; // ISO date string
  tags?: string[];
  // Add other file properties as needed
}

export interface FileTypeDetail {
  category: 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'spreadsheet' | 'code' | 'text' | 'archive' | 'other';
  mimeType: string;
  icon: 'image' | 'video' | 'audio' | 'document' | 'spreadsheet' | 'code' | 'text' | 'archive' | 'file';
  color: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'yellow' | 'gray';
  language?: string;
}

export interface PreviewContent {
  type: 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'code' | 'document' | 'spreadsheet' | 'unsupported' | 'error';
  content: string | null;
  language?: string;
  // Add other properties for specific types, e.g., sheets: string[] for spreadsheets
}

export type SortBy = 'date' | 'name' | 'size';
export type SortOrder = 'asc' | 'desc';
export type FileCategory = FileTypeDetail['category'] | 'all';