export interface SearchResult {
  file_id: number;
  page_number: number;
  filename: string;
  text_snippet: string;
  score: number;
  search_type: 'semantic' | 'keyword' | 'hybrid';
}

export interface SearchResponse {
  query: string;
  search_type: 'semantic' | 'keyword' | 'hybrid';
  count: number;
  results: SearchResult[];
  semantic_weight?: number;
  keyword_weight?: number;
}

export type SearchMode = 'semantic' | 'keyword' | 'hybrid';

export interface SearchParams {
  q: string;
  limit: number;
  threshold: number;
  semantic_weight?: number;
  keyword_weight?: number;
}
