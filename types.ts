export interface Source {
  title: string;
  uri: string;
  source?: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  result: string | null;
  sources: Source[];
  error: string | null;
  hasSearched: boolean;
}

export interface ModelConfig {
  model: string;
  usePro: boolean;
}