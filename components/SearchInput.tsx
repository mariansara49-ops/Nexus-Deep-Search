import React, { useState, KeyboardEvent } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialValue?: string;
  centered?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading, initialValue = '', centered = false }) => {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleSearchClick = () => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <div className={`w-full max-w-3xl relative group ${centered ? 'mx-auto' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 group-hover:opacity-30 blur transition-opacity duration-300 ${isLoading ? 'animate-pulse' : ''}`}></div>
      <div className="relative flex items-center bg-surface border border-slate-700 rounded-full shadow-2xl overflow-hidden transition-all focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20">
        <div className="pl-6 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="w-full bg-transparent text-white px-4 py-4 focus:outline-none placeholder-slate-500 text-lg"
          placeholder="Ask anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="pr-2">
          <button
            onClick={handleSearchClick}
            disabled={isLoading || !value.trim()}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;