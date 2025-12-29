import React from 'react';
import type { FileItem, PreviewContent } from '@/types/file-manager';
import { getFileIcon, formatFileSize, formatDate, getDetailedFileType } from '@/lib/file-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, Download, Tag } from 'lucide-react';

interface FilePreviewDialogProps {
  previewFile: FileItem | null;
  previewContent: PreviewContent | null;
  previewLoading: boolean;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onManageTags: (file: FileItem) => void;
}

const renderPreviewContent = (previewContent: PreviewContent, previewFile: FileItem | null, previewLoading: boolean, onDownload: (file: FileItem) => void) => {
  if (previewLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!previewContent || !previewFile) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <p className="text-gray-500">No preview available</p>
      </div>
    );
  }

  switch(previewContent.type) {
    case 'image':
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 h-full">
          <img 
            src={previewContent.content as string} 
            alt={previewFile.filename} 
            className="max-w-full max-h-[80vh] object-contain rounded shadow-lg" 
          />
        </div>
      );
    
    case 'video':
      return (
        <div className="flex items-center justify-center bg-black rounded-lg p-2 h-full">
          <video controls className="max-w-full max-h-[80vh] rounded">
            <source src={previewContent.content as string} />
            Your browser does not support video playback.
          </video>
        </div>
      );
    
    case 'audio':
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg h-full">
          <div className="bg-white p-8 rounded-full shadow-lg mb-6">
            <Music className="w-20 h-20 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{previewFile.filename}</h3>
          <audio controls className="w-full max-w-md shadow-md rounded-lg">
            <source src={previewContent.content as string} />
          </audio>
        </div>
      );
    
    case 'pdf':
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
          <iframe 
            src={previewContent.content as string}
            className="w-full h-full border-0"
            title={previewFile.filename}
          />
        </div>
      );

    case 'text':
    case 'code':
      return (
        <div className="bg-gray-900 rounded-lg overflow-hidden h-full">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
            <p className="text-sm font-medium text-gray-200">{previewFile.filename}</p>
            {previewContent.language && (
              <Badge variant="secondary" className="text-xs">{previewContent.language}</Badge>
            )}
          </div>
          <ScrollArea className="h-full max-h-[75vh]">
            <pre className="p-6 text-sm text-gray-100 whitespace-pre-wrap font-mono">
              {previewContent.content as string}
            </pre>
          </ScrollArea>
        </div>
      );

    case 'document':
    case 'spreadsheet':
      return (
        <div className="bg-white border rounded-lg overflow-hidden h-full">
          <div className="bg-gray-50 px-4 py-2 border-b flex-shrink-0">
            <p className="text-sm font-medium text-gray-700">{previewFile.filename}</p>
          </div>
          <ScrollArea className="h-full max-h-[75vh]">
            <div 
              className="p-8 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewContent.content as string }}
            />
          </ScrollArea>
        </div>
      );

    case 'error':
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{previewContent.content}</AlertDescription>
          </Alert>
        </div>
      );

    case 'unsupported':
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] bg-gray-100 rounded-lg">
          <div className="text-center">
            {getFileIcon(previewFile.filename)}
            <p className="text-gray-500 mt-4 font-medium">Preview not available for this file type</p>
            <Button 
              className="mt-4"
              onClick={() => onDownload(previewFile)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download to View
            </Button>
          </div>
        </div>
      );
  }
};

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ 
  previewFile, 
  previewContent, 
  previewLoading, 
  onClose, 
  onDownload, 
  onManageTags 
}) => {
  return (
    <Dialog open={!!previewFile} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            {previewFile && getFileIcon(previewFile.filename)}
            <span className="truncate">{previewFile?.filename}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto my-4">
          {previewFile && renderPreviewContent(previewContent || { type: 'unsupported', content: null }, previewFile, previewLoading, onDownload)}
        </div>
        
        <Separator className="flex-shrink-0" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm py-4 flex-shrink-0">
          <div>
            <Label className="text-gray-600">Size</Label>
            <p className="font-medium mt-1">{previewFile && formatFileSize(previewFile.file_size)}</p>
          </div>
          <div>
            <Label className="text-gray-600">Type</Label>
            <p className="font-medium mt-1 capitalize">{previewFile && getDetailedFileType(previewFile.filename).category}</p>
          </div>
          <div>
            <Label className="text-gray-600">Uploaded</Label>
            <p className="font-medium mt-1">{previewFile && formatDate(previewFile.upload_time)}</p>
          </div>
          <div>
            <Label className="text-gray-600">Tags</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {previewFile?.tags?.length ? (
                previewFile.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No tags</span>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="outline"
            onClick={() => previewFile && onManageTags(previewFile)}
          >
            <Tag className="w-4 h-4 mr-2" />
            Tags
          </Button>
          <Button onClick={() => previewFile && onDownload(previewFile)}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;