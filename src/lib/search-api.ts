import type { SearchMode, SearchParams, SearchResponse } from '@/types/search';

const API_BASE = 'http://localhost:8000';

export const searchAPI = {
  semantic: async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({
      q: params.q,
      limit: params.limit.toString(),
      threshold: params.threshold.toString(),
    });
    try {
      const response = await fetch(`${API_BASE}/search/semantic?${queryParams}`);
      if (!response.ok) throw new Error(`Semantic search failed: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Semantic search error:', error);
      throw new Error(`Semantic search failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  },

  keyword: async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({
      q: params.q,
      limit: params.limit.toString(),
      threshold: params.threshold.toString(),
    });
    try {
      const response = await fetch(`${API_BASE}/search/keyword?${queryParams}`);
      if (!response.ok) throw new Error(`Keyword search failed: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Keyword search error:', error);
      throw new Error(`Keyword search failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  },

  hybrid: async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams({
      q: params.q,
      limit: params.limit.toString(),
      threshold: params.threshold.toString(),
      semantic_weight: (params.semantic_weight ?? 0.7).toString(),
      keyword_weight: (params.keyword_weight ?? 0.3).toString(),
    });
    try {
      const response = await fetch(`${API_BASE}/search/hybrid?${queryParams}`);
      if (!response.ok) throw new Error(`Hybrid search failed: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Hybrid search error:', error);
      throw new Error(`Hybrid search failed: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  },

  search: async (mode: SearchMode, params: SearchParams): Promise<SearchResponse> => {
    switch (mode) {
      case 'semantic':
        return searchAPI.semantic(params);
      case 'keyword':
        return searchAPI.keyword(params);
      case 'hybrid':
        return searchAPI.hybrid(params);
    }
  },
};
