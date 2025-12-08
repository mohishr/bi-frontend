import React, { useState, useRef, useMemo, useCallback, createContext, useContext, useEffect } from 'react';
import { Upload, File, Image, FileText, Music, Video, X, Tag, Search, Filter, Download, Trash2, Plus, Eye, Grid3x3, List, ChevronDown, FolderOpen, MoreVertical, Edit, LogOut, Menu, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// ============================================
// API SERVICE - Centralized API calls
// ============================================
const API_BASE_URL:string = 'http://localhost:8000/';

const apiService = {
  // Auth endpoints
  login: async (email:string, password:string) => {
    // Replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (email === 'demo@example.com' && password === 'password') {
            resolve({
              success: true,
              data: {
                user: { id: 1, name: 'Demo User', email: 'demo@example.com' },
                token: 'mock-jwt-token-12345'
              }
            });
          } else {
            resolve({ success: false, error: 'Invalid credentials' });
          }
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  logout: async (token:string) => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  // File endpoints
  getFiles: async (token:string, page= 1, limit = 20, search = '', tags = []) => {
    // Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/files?page=${page}&limit=${limit}&search=${search}&tags=${tags.join(',')}`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // return response.json();
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, data: [] }), 500);
    });
  },

  uploadFile: async (token, file, tags = [], onProgress) => {
    // Replace with actual API call with progress
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('tags', JSON.stringify(tags));
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        onProgress?.(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({ success: true, data: { id: Date.now(), name: file.name } });
        }
      }, 200);
    });
  },

  deleteFile: async (token, fileId) => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  updateFileTags: async (token, fileId, tags) => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, data: { tags } }), 500);
    });
  },

  downloadFile: async (token, fileId) => {
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, url: '#' }), 500);
    });
  }
};

// ============================================
// AUTH CONTEXT - Global authentication state
// ============================================
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = sessionStorage.getItem('authToken');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true };
      }
      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    if (token) {
      await apiService.logout(token);
    }
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ============================================
// LOGIN PAGE COMPONENT
// ============================================
const LoginPage = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Login attempt:', { email, password });
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">File Manager</CardTitle>
          <CardDescription>Sign in to access your files</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              onClick={handleButtonClick}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Demo credentials:</p>
              <p className="font-mono text-xs mt-1">demo@example.com / password</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// NAVIGATION BAR COMPONENT
// ============================================
const NavigationBar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">File Manager</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="font-medium">
              <File className="w-4 h-4 mr-2" />
              My Files
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="w-4 h-4" />
                  {user?.name}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" className="justify-start">
                  <File className="w-4 h-4 mr-2" />
                  My Files
                </Button>
                
                <Separator />
                
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// FILE MANAGER COMPONENT
// ============================================
const FileManager = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([
    { id: 1, name: 'Project Proposal.pdf', size: 2457600, type: 'pdf', tags: ['work', 'important'], uploadDate: '2024-12-01', url: null, content: null },
    { id: 2, name: 'Vacation Photo.jpg', size: 5349376, type: 'image', tags: ['personal', 'photos'], uploadDate: '2024-12-03', url: null, content: null },
    { id: 3, name: 'Meeting Notes.docx', size: 159744, type: 'document', tags: ['work', 'notes'], uploadDate: '2024-12-05', url: null, content: null },
    { id: 4, name: 'Sample Document.txt', size: 45000, type: 'text', tags: ['notes'], uploadDate: '2024-12-06', url: null, content: 'This is a sample text file content.' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [fileToAddTag, setFileToAddTag] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  const allTags = useMemo(() => 
    [...new Set(files.flatMap(f => f.tags))],
    [files]
  );

  const getFileIcon = useCallback((type) => {
    const iconProps = { className: "w-8 h-8" };
    switch(type) {
      case 'image': return <Image {...iconProps} className="w-8 h-8 text-blue-500" />;
      case 'pdf': return <FileText {...iconProps} className="w-8 h-8 text-red-500" />;
      case 'document': return <FileText {...iconProps} className="w-8 h-8 text-blue-600" />;
      case 'text': return <FileText {...iconProps} className="w-8 h-8 text-green-600" />;
      case 'audio': return <Music {...iconProps} className="w-8 h-8 text-purple-500" />;
      case 'video': return <Video {...iconProps} className="w-8 h-8 text-pink-500" />;
      default: return <File {...iconProps} className="w-8 h-8 text-gray-500" />;
    }
  }, []);

  const getFileType = useCallback((fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx', 'odt'].includes(ext)) return 'document';
    if (['txt', 'md', 'csv', 'json', 'xml', 'log'].includes(ext)) return 'text';
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return 'video';
    return 'file';
  }, []);

  const readFileContent = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      
      const fileType = getFileType(file.name);
      if (fileType === 'text') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  }, [getFileType]);

  const handleFileUpload = useCallback(async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // In production, upload to API
    const newFiles = await Promise.all(
      uploadedFiles.map(async (file, idx) => {
        // Simulate API upload with progress
        await apiService.uploadFile(token, file, [], (progress) => {
          setUploadProgress(((idx + (progress / 100)) / uploadedFiles.length) * 100);
        });

        const url = URL.createObjectURL(file);
        const type = getFileType(file.name);
        let content = null;

        try {
          if (type === 'text') {
            content = await readFileContent(file);
          }
        } catch (error) {
          console.error('Error reading file:', error);
        }

        return {
          id: Date.now() + idx,
          name: file.name,
          size: file.size,
          type: type,
          tags: [],
          uploadDate: new Date().toISOString().split('T')[0],
          url: url,
          content: content,
          fileObject: file
        };
      })
    );

    setFiles(prev => [...newFiles, ...prev]);
    setIsUploading(false);
    setUploadProgress(0);
    setShowUploadDialog(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [token, getFileType, readFileContent]);

  const deleteFile = useCallback(async (id) => {
    // In production, call API
    await apiService.deleteFile(token, id);
    
    const fileToDelete = files.find(f => f.id === id);
    if (fileToDelete?.url) {
      URL.revokeObjectURL(fileToDelete.url);
    }
    setFiles(prev => prev.filter(f => f.id !== id));
    if (previewFile?.id === id) {
      setPreviewFile(null);
    }
  }, [files, previewFile, token]);

  const downloadFile = useCallback(async (file) => {
    // In production, call API to get download URL
    // const response = await apiService.downloadFile(token, file.id);
    
    if (file.url && file.fileObject) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const openPreview = useCallback((file) => {
    setPreviewFile(file);
  }, []);

  const toggleTagFilter = useCallback((tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  }, []);

  const addTagToFile = useCallback(async (fileId, tag) => {
    if (!tag.trim()) return;
    const normalizedTag = tag.toLowerCase().trim();
    
    // In production, call API
    // await apiService.updateFileTags(token, fileId, [...file.tags, normalizedTag]);
    
    setFiles(prev => prev.map(f => 
      f.id === fileId && !f.tags.includes(normalizedTag) 
        ? { ...f, tags: [...f.tags, normalizedTag] }
        : f
    ));
    setNewTag('');
  }, []);

  const removeTagFromFile = useCallback(async (fileId, tagToRemove) => {
    // In production, call API
    const file = files.find(f => f.id === fileId);
    // await apiService.updateFileTags(token, fileId, file.tags.filter(t => t !== tagToRemove));
    
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, tags: f.tags.filter(t => t !== tagToRemove) }
        : f
    ));
  }, [files]);

  const openAddTagDialog = useCallback((file, e) => {
    e?.stopPropagation();
    setFileToAddTag(file);
    setShowAddTagDialog(true);
  }, []);

  const sortedAndFilteredFiles = useMemo(() => {
    let filtered = files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => file.tags.includes(tag));
      return matchesSearch && matchesTags;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch(sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
          comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchQuery, selectedTags, sortBy, sortOrder]);

  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredFiles.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredFiles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredFiles.length / itemsPerPage);

  const renderPreview = useCallback(() => {
    if (!previewFile) return null;
    console.log(previewFile);
    switch(previewFile.type) {
      case 'image':
        return previewFile.url ? (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <img 
              src={previewFile.url} 
              alt={previewFile.name} 
              className="max-w-full max-h-[70vh] object-contain rounded shadow-lg" 
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Image preview not available</p>
            </div>
          </div>
        );
      
      case 'video':
        return previewFile.url ? (
          <div className="flex items-center justify-center bg-black rounded-lg p-2">
            <video controls className="max-w-full max-h-[70vh] rounded">
              <source src={previewFile.url} />
              Your browser does not support video playback.
            </video>
          </div>
        ) : null;
      
      case 'audio':
        return previewFile.url ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="bg-white p-8 rounded-full shadow-lg mb-6">
              <Music className="w-20 h-20 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{previewFile.name}</h3>
            <audio controls className="w-full max-w-md shadow-md rounded-lg">
              <source src={previewFile.url} />
            </audio>
          </div>
        ) : null;
      
      case 'pdf':
        return previewFile.url ? (
          <div className="w-full h-[75vh] bg-gray-100 rounded-lg overflow-hidden">
            <iframe 
              src={`${previewFile.url}#toolbar=1`}
              className="w-full h-full border-0"
              title={previewFile.name}
            />
          </div>
        ) : null;

      case 'text':
        return (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-700">{previewFile.name}</p>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {previewFile.content || 'No content available'}
              </pre>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              {getFileIcon(previewFile.type)}
              <p className="text-gray-500 mt-4 font-medium">Preview not available</p>
              <Button 
                className="mt-4"
                onClick={() => downloadFile(previewFile)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download to View
              </Button>
            </div>
          </div>
        );
    }
  }, [
    // previewFile, 
    getFileIcon, downloadFile
  ]);

  const FileCardActions = ({ file }) => (
    <div className="flex gap-2 mt-auto">
      <Button
        size="sm"
        variant="outline"
        className="flex-1"
        onClick={(e) => {
          e.stopPropagation();
          openPreview(file);
        }}
      >
        <Eye className="w-3 h-3 mr-1" />
        Preview
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => openAddTagDialog(file, e)}
      >
        <Tag className="w-3 h-3" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="outline">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => downloadFile(file)}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openAddTagDialog(file)}>
            <Edit className="w-4 h-4 mr-2" />
            Manage Tags
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600"
            onClick={() => {
              if (confirm(`Delete ${file.name}?`)) {
                deleteFile(file.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Files</h1>
          <p className="text-gray-600">{sortedAndFilteredFiles.length} files • {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))} total</p>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Button 
                onClick={() => setShowUploadDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
              
              <div className="flex-1 min-w-[200px] max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search files and tags..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </Button>

              <Separator orientation="vertical" className="h-8" />

              <div className="flex gap-1 border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="h-6 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Display */}
        {sortedAndFilteredFiles.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-500 mb-4">
                  {files.length === 0 
                    ? 'Upload some files to get started!' 
                    : 'Try adjusting your search or filter criteria.'}
                </p>
                {files.length === 0 && (
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedFiles.map(file => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
                      {file.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {file.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{file.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <FileCardActions file={file} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {paginatedFiles.map(file => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="font-medium text-sm truncate max-w-xs" title={file.name}>{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{file.type}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {file.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                          {file.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">+{file.tags.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{file.uploadDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => openPreview(file)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={(e) => openAddTagDialog(file, e)}>
                            <Tag className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => downloadFile(file)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm(`Delete ${file.name}?`)) {
                                    deleteFile(file.id);
                                  }
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredFiles.length)} of {sortedAndFilteredFiles.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>
                Select files to upload
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed"
                variant="outline"
                disabled={isUploading}
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="font-medium">{isUploading ? 'Uploading...' : 'Click to select files'}</p>
                  {isUploading && (
                    <div className="w-full max-w-xs">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">{Math.round(uploadProgress)}%</p>
                    </div>
                  )}
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tag Dialog */}
        <Dialog open={showAddTagDialog} onOpenChange={setShowAddTagDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
              <DialogDescription>
                Add or remove tags for {fileToAddTag?.name}
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
                      if (e.key === 'Enter' && fileToAddTag && newTag.trim()) {
                        addTagToFile(fileToAddTag.id, newTag);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      if (fileToAddTag && newTag.trim()) {
                        addTagToFile(fileToAddTag.id, newTag);
                      }
                    }}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {fileToAddTag && fileToAddTag.tags.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Tags</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                    {fileToAddTag.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <X 
                          className="w-3 h-3 ml-2 cursor-pointer hover:text-red-500"
                          onClick={() => {
                            removeTagFromFile(fileToAddTag.id, tag);
                            setFileToAddTag(prev => ({
                              ...prev,
                              tags: prev.tags.filter(t => t !== tag)
                            }));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => {
                setShowAddTagDialog(false);
                setNewTag('');
              }}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {previewFile && getFileIcon(previewFile.type)}
                <span className="truncate">{previewFile?.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-auto py-4">
              {renderPreview()}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm py-4">
              <div>
                <Label className="text-gray-600">Size</Label>
                <p className="font-medium mt-1">{previewFile && formatFileSize(previewFile.size)}</p>
              </div>
              <div>
                <Label className="text-gray-600">Type</Label>
                <p className="font-medium mt-1 capitalize">{previewFile?.type}</p>
              </div>
              <div>
                <Label className="text-gray-600">Uploaded</Label>
                <p className="font-medium mt-1">{previewFile?.uploadDate}</p>
              </div>
              <div>
                <Label className="text-gray-600">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {previewFile?.tags.length > 0 ? (
                    previewFile.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No tags</span>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                Close
              </Button>
              <Button 
                variant="outline"
                onClick={() => previewFile && openAddTagDialog(previewFile)}
              >
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </Button>
              <Button onClick={() => previewFile && downloadFile(previewFile)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FolderOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <FileManager />
    </div>
  );
};

// ============================================
// ROOT COMPONENT WITH PROVIDER
// ============================================
const FileManagerApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default FileManagerApp;