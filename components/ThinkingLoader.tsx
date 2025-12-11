import React from 'react';
import { BrainCircuit, Globe, SearchCheck } from 'lucide-react';

interface ThinkingLoaderProps {
  query: string;
}

const ThinkingLoader: React.FC<ThinkingLoaderProps> = ({ query }) => {
  const steps = [
    { icon: Globe, text: "Scanning global information..." },
    { icon: BrainCircuit, text: "Synthesizing insights..." },
    { icon: SearchCheck, text: "Validating sources..." },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
           <BrainCircuit className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-xl font-medium text-white mb-2 text-center">
        Deep searching for "<span className="text-cyan-400">{query}</span>"
      </h3>
      
      <div className="flex flex-col gap-2 mt-4 w-full max-w-xs">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isPast = idx < activeStep; // In a real loop this logic is tricky, but for simple visual:
          
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3 text-sm transition-all duration-500 ${isActive ? 'text-cyan-400 scale-105 font-medium' : 'text-slate-600'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
              <span>{step.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThinkingLoader;