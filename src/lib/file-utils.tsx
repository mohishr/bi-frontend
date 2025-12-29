import type { FileTypeDetail } from '@/types/file-manager';
import { Image, Film, Music, FileText, FileSpreadsheet, Code, Archive, File } from 'lucide-react';
import React from 'react';

export const API_BASE = 'http://localhost:8000/files';

export const getDetailedFileType = (filename: string): FileTypeDetail => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  const types: Record<string, FileTypeDetail> = {
    // Images
    jpg: { category: 'image', mimeType: 'image/jpeg', icon: 'image', color: 'blue' },
    jpeg: { category: 'image', mimeType: 'image/jpeg', icon: 'image', color: 'blue' },
    png: { category: 'image', mimeType: 'image/png', icon: 'image', color: 'blue' },
    gif: { category: 'image', mimeType: 'image/gif', icon: 'image', color: 'blue' },
    svg: { category: 'image', mimeType: 'image/svg+xml', icon: 'image', color: 'blue' },
    webp: { category: 'image', mimeType: 'image/webp', icon: 'image', color: 'blue' },
    // Videos
    mp4: { category: 'video', mimeType: 'video/mp4', icon: 'video', color: 'purple' },
    avi: { category: 'video', mimeType: 'video/x-msvideo', icon: 'video', color: 'purple' },
    // Audio
    mp3: { category: 'audio', mimeType: 'audio/mpeg', icon: 'audio', color: 'green' },
    wav: { category: 'audio', mimeType: 'audio/wav', icon: 'audio', color: 'green' },
    // Documents
    pdf: { category: 'pdf', mimeType: 'application/pdf', icon: 'document', color: 'red' },
    doc: { category: 'document', mimeType: 'application/msword', icon: 'document', color: 'blue' },
    docx: { category: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'document', color: 'blue' },
    // Spreadsheets
    xlsx: { category: 'spreadsheet', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: 'spreadsheet', color: 'green' },
    csv: { category: 'spreadsheet', mimeType: 'text/csv', icon: 'spreadsheet', color: 'green' },
    // Text & Code
    txt: { category: 'text', mimeType: 'text/plain', icon: 'text', color: 'gray', language: 'plaintext' },
    ts: { category: 'code', mimeType: 'text/typescript', icon: 'code', color: 'blue', language: 'typescript' },
    tsx: { category: 'code', mimeType: 'text/typescript', icon: 'code', color: 'blue', language: 'typescript' },
    json: { category: 'code', mimeType: 'application/json', icon: 'code', color: 'yellow', language: 'json' },
    // Archives
    zip: { category: 'archive', mimeType: 'application/zip', icon: 'archive', color: 'orange' },
  };

  return types[ext] || { category: 'other', mimeType: 'application/octet-stream', icon: 'file', color: 'gray' };
};

export const getFileIcon = (filename: string): React.ReactElement => {
  const fileType = getDetailedFileType(filename);
  const colorMap: Record<FileTypeDetail['color'], string> = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    yellow: 'text-yellow-500',
    gray: 'text-gray-500'
  };

  const iconProps = { className: `w-5 h-5 ${colorMap[fileType.color]} mr-2 flex-shrink-0` };

  switch(fileType.icon) {
    case 'image': return <Image {...iconProps} />;
    case 'video': return <Film {...iconProps} />;
    case 'audio': return <Music {...iconProps} />;
    case 'document': return <FileText {...iconProps} />;
    case 'spreadsheet': return <FileSpreadsheet {...iconProps} />;
    case 'code': return <Code {...iconProps} />;
    case 'text': return <FileText {...iconProps} />;
    case 'archive': return <Archive {...iconProps} />;
    default: return <File {...iconProps} />;
  }
};

export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || bytes === null || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};