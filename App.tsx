import React, { useState } from 'react';
import { Compass, Sparkles, History, Search } from 'lucide-react';
import SearchInput from './components/SearchInput';
import AnswerSection from './components/AnswerSection';
import ThinkingLoader from './components/ThinkingLoader';
import { performDeepSearch } from './services/geminiService';
import { SearchState } from './types';

const SUGGESTIONS = [
  "Latest breakthroughs in nuclear fusion",
  "History of the Roman Empire's fall",
  "Comparison of React vs Vue in 2025",
  "How do quantum computers work?",
];

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    isSearching: false,
    result: null,
    sources: [],
    error: null,
    hasSearched: false,
  });

  const [useProModel, setUseProModel] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setState((prev) => ({
      ...prev,
      query,
      isSearching: true,
      error: null,
      hasSearched: true,
      result: null, // Clear previous results immediately
      sources: []
    }));

    try {
      const { text, sources } = await performDeepSearch(query, useProModel);
      setState((prev) => ({
        ...prev,
        isSearching: false,
        result: text,
        sources,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isSearching: false,
        error: error.message || "Failed to perform search",
      }));
    }
  };

  const handleReset = () => {
    setState({
      query: '',
      isSearching: false,
      result: null,
      sources: [],
      error: null,
      hasSearched: false,
    });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${state.hasSearched ? 'bg-background/80 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={handleReset}
          >
            <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">Nexus</span>
          </div>
          
          {state.hasSearched && (
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <SearchInput 
                onSearch={handleSearch} 
                isLoading={state.isSearching} 
                initialValue={state.query}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
             {/* Model Toggle */}
             <button 
                onClick={() => setUseProModel(!useProModel)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${useProModel ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                title="Pro model uses Gemini 1.5 Pro for deeper reasoning but is slower."
             >
                <Sparkles className="w-3 h-3" />
                {useProModel ? 'Pro Model' : 'Flash Model'}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 min-h-screen flex flex-col">
        
        {!state.hasSearched ? (
          // HERO SECTION
          <div className="flex-1 flex flex-col items-center justify-center -mt-20 animate-fadeIn">
            <div className="text-center mb-10 max-w-2xl mx-auto">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 text-xs font-medium mb-6">
                 <Sparkles className="w-3 h-3" />
                 <span>Powered by Gemini 2.5 & Google Search</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                 Deep Search <br/> everything.
               </h1>
               <p className="text-slate-400 text-lg md:text-xl">
                 Real-time web access combined with advanced AI reasoning.
               </p>
            </div>

            <div className="w-full max-w-2xl px-4">
              <SearchInput onSearch={handleSearch} isLoading={state.isSearching} centered />
              
              <div className="mt-8">
                <p className="text-sm text-slate-500 mb-3 text-center">Try asking about...</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className="px-4 py-2 rounded-full bg-surface border border-slate-700 text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // RESULTS SECTION
          <div className="max-w-7xl mx-auto w-full flex-1">
            {state.isSearching ? (
              <ThinkingLoader query={state.query} />
            ) : state.error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Search Failed</h3>
                <p className="text-slate-400 max-w-md">{state.error}</p>
                <button 
                  onClick={() => handleSearch(state.query)}
                  className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="animate-fadeInUp">
                {/* Mobile Search Input (if not in header) */}
                <div className="md:hidden mb-6">
                   <SearchInput 
                    onSearch={handleSearch} 
                    isLoading={state.isSearching} 
                    initialValue={state.query}
                  />
                </div>

                {state.result && (
                  <AnswerSection 
                    content={state.result} 
                    sources={state.sources} 
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-xs border-t border-slate-800/50">
        <p>© 2025 Nexus AI Inc. Built with React & Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;