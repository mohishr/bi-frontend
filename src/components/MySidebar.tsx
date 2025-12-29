import React from 'react';
import { FolderOpen, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onSelectView, isSidebarOpen }) => {
  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold">File Manager</h1>
        </div>

        <nav className="space-y-2">
          <div className="px-2 py-2 text-sm font-semibold text-gray-500">
            Navigation
          </div>
          
          <Button
            variant={activeView === 'recent' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onSelectView('recent')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Recent Files
          </Button>

          <Button
            variant={activeView === 'chat-search' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onSelectView('chat-search')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Search
          </Button>
          
          <Separator className="my-4" />
          
          {/* Future expansion: Add other navigation links here */}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;