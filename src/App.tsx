import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

// Import Types and Utils
import type { FileItem, FileCategory, SortBy, SortOrder, PreviewContent } from '@/types/file-manager';
import { API_BASE, getDetailedFileType } from '@/lib/file-utils';

// Import Components
import Sidebar from '@/components/MySidebar';
import AppToolbar from '@/components/MyAppToolbar';
import FilterBar from '@/components/FilterBar';
import FileList from '@/components/FileList';
import FilePreviewDialog from '@/components/FilePreviewDialog';
import TagManagementDialog from '@/components/TagManagementDialog';
import ChatSearch from '@/components/ChatSearch';


const App: React.FC = () => {
  // --- Core States ---
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'recent' | 'search' | 'tag' | 'date' | 'chat-search'>('recent'); // For sidebar highlighting

  // --- Filter & Sort States ---
  const [searchQuery, setSearchQuery] = useState(''); // API Search
  const [localSearchQuery, setLocalSearchQuery] = useState(''); // Local filtering after API search
  const [selectedTag, setSelectedTag] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fileType, setFileType] = useState<FileCategory>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // --- Upload States ---
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  // --- Preview States ---
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // --- Tag Management States ---
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [fileToAddTag, setFileToAddTag] = useState<FileItem | null>(null);


  // --- Derived State/Memoized Values ---
  const allTags: string[] = useMemo(() => {
    const tags = files.flatMap(f => f.tags?.map(t => t) || []);
    return [...new Set(tags)].sort();
  }, [files]);
  
  // --- Effects ---
  useEffect(() => {
    fetchRecentFiles();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [files, localSearchQuery, fileType, sortBy, sortOrder]);


  // --- API Call Functions ---

  const fetchRecentFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearchQuery('');
    setLocalSearchQuery('');
    setSelectedTag('all');
    setStartDate('');
    setEndDate('');
    setFileType('all');
    try {
      const response = await fetch(`${API_BASE}/recent?limit=50`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data: FileItem[] = await response.json();
      console.log(data)
      setFiles(data);
      setActiveView('recent');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFiles = useCallback(async () => {
    if (!searchQuery.trim()) {
      fetchRecentFiles();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/search?pattern=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search files');
      const data: FileItem[] = await response.json();
      setFiles(data);
      setActiveView('search');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, fetchRecentFiles]);

  const filterByTag = useCallback(async (tag: string) => {
    if (!tag || tag === 'all') {
      fetchRecentFiles();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/by-tag?tag=${encodeURIComponent(tag)}`);
      if (!response.ok) throw new Error('Failed to filter by tag');
      const data: FileItem[] = await response.json();
      setFiles(data);
      setActiveView('tag');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchRecentFiles]);

  const filterByDateRange = useCallback(async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/date-range?start_date=${startDate}&end_date=${endDate}`);
      if (!response.ok) throw new Error('Failed to filter by date');
      const data: FileItem[] = await response.json();
      setFiles(data);
      setActiveView('date');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const handleUpload = useCallback(async () => {
    if (!uploadFile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload file');
      
      setUploadOpen(false);
      setUploadFile(null);
      fetchRecentFiles();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [uploadFile, fetchRecentFiles]);

  const deleteFile = useCallback(async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${fileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete file');
      fetchRecentFiles();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchRecentFiles]);

  const addTagToFile = useCallback(async (fileId: string, tag: string) => {
    try {
      const response = await fetch(`${API_BASE}/${fileId}/tags?tag=${encodeURIComponent(tag)}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to add tag');
      setShowAddTagDialog(false);
      setFileToAddTag(null);
      fetchRecentFiles();
    } catch (err) {
      setError((err as Error).message);
    }
  }, [fetchRecentFiles]);

  const removeTagFromFile = useCallback(async (fileId: string, tag: string) => {
    try {
      const response = await fetch(`${API_BASE}/${fileId}/tags?tag=${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove tag');
      setShowAddTagDialog(false);
      setFileToAddTag(null);
      fetchRecentFiles();
    } catch (err) {
      setError((err as Error).message);
    }
  }, [fetchRecentFiles]);

  const downloadFile = useCallback(async (file: FileItem) => {
    try {
      const response = await fetch(`${API_BASE}/${file.file_id}`);
      if (!response.ok) throw new Error('Failed to download file');
      const data: { blob?: string } = await response.json();
      
      if (data.blob) {
        const byteCharacters = atob(data.blob);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  // --- File Preview Logic ---

  const fetchFileContent = async (file: FileItem): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE}/${file.file_id}`);
      if (!response.ok) throw new Error('Failed to fetch file');
      const data: { blob?: string } = await response.json();
      if (!data.blob) throw new Error('File content not found');
      return data.blob;
    } catch (err) {
      throw new Error('Failed to load file content');
    }
  };

  const openPreview = useCallback(async (file: FileItem) => {
    setPreviewFile(file);
    setPreviewLoading(true);
    setPreviewContent(null);

    try {
      const base64Content = await fetchFileContent(file);
      const fileTypeDetails = getDetailedFileType(file.filename);
      const fileTypeCategory = fileTypeDetails.category;
      
      if (fileTypeCategory === 'text' || fileTypeCategory === 'code') {
        const text = atob(base64Content);
        setPreviewContent({ type: fileTypeCategory, content: text, language: fileTypeDetails.language });
      } else if (fileTypeCategory === 'image') {
        setPreviewContent({ type: 'image', content: `data:${fileTypeDetails.mimeType};base64,${base64Content}` });
      } else if (fileTypeCategory === 'pdf') {
        setPreviewContent({ type: 'pdf', content: `data:application/pdf;base64,${base64Content}` });
      } else if (fileTypeCategory === 'video') {
        setPreviewContent({ type: 'video', content: `data:${fileTypeDetails.mimeType};base64,${base64Content}` });
      } else if (fileTypeCategory === 'audio') {
        setPreviewContent({ type: 'audio', content: `data:${fileTypeDetails.mimeType};base64,${base64Content}` });
      } else if (fileTypeCategory === 'spreadsheet') {
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const workbook = XLSX.read(bytes, { type: 'array' });
        // NOTE: This conversion only supports the first sheet for simplicity
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]); 
        setPreviewContent({ type: 'spreadsheet', content: html });
      } else if (fileTypeCategory === 'document') {
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        // NOTE: mammoth only supports .docx
        const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
        setPreviewContent({ type: 'document', content: result.value });
      } else {
        setPreviewContent({ type: 'unsupported', content: null });
      }
    } catch (err) {
      console.error('Preview error:', err);
      setPreviewContent({ type: 'error', content: (err as Error).message });
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  // --- Chat Search Handler ---

  const handleChatSearchResult = useCallback(async (result: any) => {
    // Handle click on a search result from ChatSearch
    // Open file preview if file_id is available
    const fileWithId = files.find(f => f.file_id === result.file_id.toString());
    if (fileWithId) {
      await openPreview(fileWithId);
    } else {
      // If file not in current list, we can still show the preview with file_id
      setPreviewFile({
        file_id: result.file_id.toString(),
        filename: result.filename,
        file_size: 0,
        upload_time: new Date().toISOString(),
        tags: [],
      });
      await openPreview({
        file_id: result.file_id.toString(),
        filename: result.filename,
        file_size: 0,
        upload_time: new Date().toISOString(),
        tags: [],
      });
    }
  }, [files, openPreview]);

  // --- Local Filter & Sort Logic ---

  const applyFiltersAndSort = useCallback(() => {
    let result = [...files];

    // 1. Local Search Filter (Search within current API results)
    if (localSearchQuery.trim()) {
      const lowerCaseQuery = localSearchQuery.toLowerCase();
      result = result.filter(f => f.filename.toLowerCase().includes(lowerCaseQuery));
    }

    // 2. File Type Filter
    if (fileType !== 'all') {
      result = result.filter(f => {
        const type = getDetailedFileType(f.filename);
        return type.category === fileType;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.filename.localeCompare(b.filename);
      } else if (sortBy === 'size') {
        comparison = (a.file_size || 0) - (b.file_size || 0);
      } else if (sortBy === 'date') {
        comparison = new Date(a.upload_time || 0).getTime() - new Date(b.upload_time || 0).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredFiles(result);
  }, [files, localSearchQuery, fileType, sortBy, sortOrder]);


  // --- Handler Prop Callbacks ---

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocalSearchQuery('');
    setSelectedTag('all');
    setStartDate('');
    setEndDate('');
    setFileType('all');
    // Re-fetch to reset API results to recent
    fetchRecentFiles(); 
  };
  
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    filterByTag(tag);
  };
  
  const handleManageTags = (file: FileItem) => {
    setFileToAddTag(file);
    setShowAddTagDialog(true);
    setPreviewFile(null); // Close preview if open
  }
  
  const closePreview = () => {
    setPreviewFile(null);
    setPreviewContent(null);
  }


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <Sidebar 
        isSidebarOpen={sidebarOpen} 
        activeView={activeView} 
        onSelectView={(view: string) => {
          if (view === 'chat-search' || view === 'recent' || view === 'search' || view === 'tag' || view === 'date') {
            setActiveView(view);
            if (view === 'recent') {
              fetchRecentFiles();
            }
          }
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <AppToolbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={searchFiles}
          loading={loading}
          uploadOpen={uploadOpen}
          onOpenUpload={setUploadOpen}
          onFileUpload={setUploadFile}
          onUploadSubmit={handleUpload}
        />

        {/* Chat Search View */}
        {activeView === 'chat-search' ? (
          <ChatSearch onResultClick={handleChatSearchResult} />
        ) : (
          <>
            <FilterBar
              allTags={allTags}
              selectedTag={selectedTag}
              startDate={startDate}
              endDate={endDate}
              fileType={fileType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onTagChange={handleTagChange}
              onDateChange={(type, date) => type === 'start' ? setStartDate(date) : setEndDate(date)}
              onFileTypeChange={setFileType}
              onApplyDateFilter={filterByDateRange}
              onSortByChange={setSortBy}
              onSortOrderToggle={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              onClearFilters={handleClearFilters}
              loading={loading}
              error={error}
            />
            
            {/* Local Search and File List Section */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              
              <div className="mb-4">
                <Input
                  placeholder="Search in filtered results..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4 flex-shrink-0">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <ScrollArea className="flex-1 -m-6 p-6">
                <FileList
                  files={filteredFiles}
                  loading={loading}
                  error={error}
                  onPreview={openPreview}
                  onDownload={downloadFile}
                  onDelete={deleteFile}
                  onManageTags={handleManageTags}
                />
              </ScrollArea>
            </div>
          </>
        )}
      </div>

      <TagManagementDialog
        fileToAddTag={fileToAddTag}
        showAddTagDialog={showAddTagDialog}
        onClose={() => {
          setShowAddTagDialog(false);
          setFileToAddTag(null);
        }}
        onAddTag={addTagToFile}
        onRemoveTag={removeTagFromFile}
      />

      <FilePreviewDialog
        previewFile={previewFile}
        previewContent={previewContent}
        previewLoading={previewLoading}
        onClose={closePreview}
        onDownload={downloadFile}
        onManageTags={handleManageTags}
      />
    </div>
  );
};

export default App;