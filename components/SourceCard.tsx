import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { Source } from '../types';

interface SourceCardProps {
  source: Source;
  index: number;
}

const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  // Extract domain for display
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'web';
    }
  };

  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col p-3 bg-surface border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 group h-full"
    >
      <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">
        <Globe className="w-3 h-3" />
        <span className="truncate max-w-[150px]">{getDomain(source.uri)}</span>
        <span className="ml-auto opacity-50">#{index + 1}</span>
      </div>
      <h4 className="text-sm font-medium text-slate-200 line-clamp-2 mb-1 group-hover:text-white leading-relaxed">
        {source.title}
      </h4>
      <div className="mt-auto pt-2 flex items-center text-xs text-slate-500">
        <span className="flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
          Visit <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
};

export default SourceCard;