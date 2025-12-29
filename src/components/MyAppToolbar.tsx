import React from 'react';
import { Menu, X, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface AppToolbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  loading: boolean;
  
  // Upload Props
  uploadOpen: boolean;
  onOpenUpload: (open: boolean) => void;
  onFileUpload: (file: File | null) => void;
  onUploadSubmit: () => void;
}

const AppToolbar: React.FC<AppToolbarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  loading,
  uploadOpen,
  onOpenUpload,
  onFileUpload,
  onUploadSubmit,
}) => {
  const [currentUploadFile, setCurrentUploadFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCurrentUploadFile(file);
    onFileUpload(file);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear input for next upload
    }
    onUploadSubmit();
    setCurrentUploadFile(null);
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search-input"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button onClick={onSearchSubmit} disabled={loading}>
            Search
          </Button>
        </div>
      </div>

      <Dialog open={uploadOpen} onOpenChange={(open) => {
        onOpenUpload(open);
        if (!open) {
          setCurrentUploadFile(null);
          onFileUpload(null);
        }
      }}>
        <DialogTrigger asChild>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Select a file to upload to your storage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                onChange={handleFileChange}
              />
            </div>
            {currentUploadFile && (
              <p className="text-sm text-gray-600">Selected: **{currentUploadFile.name}**</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenUpload(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadClick} disabled={!currentUploadFile || loading}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default AppToolbar;