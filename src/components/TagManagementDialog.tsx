import React from 'react';
import type { FileItem } from '@/types/file-manager';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface TagManagementDialogProps {
  fileToAddTag: FileItem | null;
  showAddTagDialog: boolean;
  onClose: () => void;
  onAddTag: (fileId: string, tag: string) => void;
  onRemoveTag: (fileId: string, tag: string) => void;
}

const TagManagementDialog: React.FC<TagManagementDialogProps> = ({
  fileToAddTag,
  showAddTagDialog,
  onClose,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (fileToAddTag && newTag.trim()) {
      onAddTag(fileToAddTag.file_id, newTag.trim());
      setNewTag('');
    }
  };

  React.useEffect(() => {
    if (!showAddTagDialog) {
      setNewTag(''); // Clear input when dialog closes
    }
  }, [showAddTagDialog]);

  return (
    <Dialog open={showAddTagDialog} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Add or remove tags for **{fileToAddTag?.filename}**
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Add New Tag</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter tag name..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
              <Button 
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {fileToAddTag && fileToAddTag.tags && fileToAddTag.tags.length > 0 && (
            <div className="space-y-2">
              <Label>Current Tags</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                {fileToAddTag.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                    <button
                      className="w-3 h-3 ml-2 cursor-pointer hover:text-red-500"
                      onClick={() => onRemoveTag(fileToAddTag.file_id,tag)}>
                        X
                        </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagementDialog;