import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { SearchResult } from '@/types/search';
import { FileText, ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  onResultClick,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <FileText className="w-12 h-12 mb-2 opacity-20" />
        <p className="text-sm">No results found. Try a different query.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 border rounded-lg bg-background">
      <div className="space-y-3 p-4">
        {results.map((result, index) => (
          <div
            key={`${result.file_id}-${result.page_number}-${index}`}
            className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
            onClick={() => onResultClick?.(result)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold truncate">{result.filename}</h4>
                  {result.page_number > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Page {result.page_number}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {result.text_snippet}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {result.search_type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Match: {(result.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SearchResults;
