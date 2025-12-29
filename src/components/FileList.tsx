import React from 'react';
import  { type FileItem } from '@/types/file-manager';
import { getFileIcon, formatFileSize, formatDate } from '@/lib/file-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Tag, Download, Trash2, File } from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  loading: boolean;
  error: string | null;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
  onManageTags: (file: FileItem) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  loading,
  error,
  onPreview,
  onDownload,
  onDelete,
  onManageTags,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No files found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or upload a new file</p>
        </div>
      </div>
    );
  }

  return (
    <Card className='shadow-none'>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {files.map(file => (
              <tr key={file.file_id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onPreview(file)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.filename)}
                    <span className="font-medium text-sm truncate max-w-xs" title={file.filename}>{file.filename}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(file.file_size)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {file.tags?.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                    {file.tags && file.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">+{file.tags.length - 2}</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(file.upload_time)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation();
                      onPreview(file);
                    }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onManageTags(file);
                        }}>
                          <Tag className="w-4 h-4 mr-2" />
                          Manage Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onDownload(file);
                        }}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(file.file_id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default FileList;