import React from 'react';
import { Filter, SortAsc, SortDesc, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FileCategory, SortBy, SortOrder } from '@/types/file-manager';

interface FilterBarProps {
  allTags: string[];
  
  // Filter States
  selectedTag: string;
  startDate: string;
  endDate: string;
  fileType: FileCategory;
  
  // Sort States
  sortBy: SortBy;
  sortOrder: SortOrder;
  
  // Handlers
  onTagChange: (tag: string) => void;
  onDateChange: (type: 'start' | 'end', date: string) => void;
  onFileTypeChange: (type: FileCategory) => void;
  onApplyDateFilter: () => void;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderToggle: () => void;
  onClearFilters: () => void;
  
  loading: boolean;
  error: string | null;
}

const FilterBar: React.FC<FilterBarProps> = ({
  allTags,
  selectedTag,
  startDate,
  endDate,
  fileType,
  sortBy,
  sortOrder,
  onTagChange,
  onDateChange,
  onFileTypeChange,
  onApplyDateFilter,
  onSortByChange,
  onSortOrderToggle,
  onClearFilters,
  loading,
}) => {
  return (
    <div className="bg-white border-b px-6 py-3 flex-shrink-0">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Tag Filter */}
        <Select value={selectedTag} onValueChange={(val) => onTagChange(val)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* File Type Filter */}
        <Select value={fileType} onValueChange={(val: FileCategory) => onFileTypeChange(val)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="File type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="archive">Archives</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange('start', e.target.value)}
            className="w-40"
          />
          <span className="text-sm text-gray-500">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange('end', e.target.value)}
            className="w-40"
          />
          <Button onClick={onApplyDateFilter} size="sm" disabled={loading || !startDate || !endDate}>
            Apply
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort:</span>
          <Select value={sortBy} onValueChange={(val: SortBy) => onSortByChange(val)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSortOrderToggle}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>

        {/* View Mode (List Mode is mandatory, but keep icon for context) */}
        <div className="flex gap-1 border rounded-md ml-auto">
          <Button
            variant="default" // Always default since grid is removed
            size="icon"
            className="rounded-l-md rounded-r-md"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;