import React from 'react';
import type { SearchMode } from '@/types/search';
import { Zap, MessageSquare, Search } from 'lucide-react';

interface SearchModeToggleProps {
  currentMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  disabled?: boolean;
}

const SearchModeToggle: React.FC<SearchModeToggleProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
}) => {
  const modes: { mode: SearchMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      mode: 'semantic',
      label: 'Semantic',
      icon: <Zap className="w-4 h-4" />,
      description: 'Similar meaning',
    },
    {
      mode: 'keyword',
      label: 'Keyword',
      icon: <Search className="w-4 h-4" />,
      description: 'Exact terms',
    },
    {
      mode: 'hybrid',
      label: 'Hybrid',
      icon: <MessageSquare className="w-4 h-4" />,
      description: 'Combined',
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {modes.map(({ mode, label, icon, description }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            currentMode === mode
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-input hover:bg-accent'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={description}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchModeToggle;
