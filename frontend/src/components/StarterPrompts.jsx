import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Feather, Target, Lightbulb } from 'lucide-react';
import api from '../services/api';

const StarterPrompts = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dailyPrompts'],
    queryFn: async () => {
      const res = await api.get('/journals/prompts');
      return res.data.prompts;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const getIcon = (type) => {
    switch(type) {
      case 'Reflection': return <Feather size={16} />;
      case 'Action': return <Target size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  const handlePromptClick = (text) => {
    // Navigate to new journal with the prompt encoded in URL
    navigate(`/journal/new?prompt=${encodeURIComponent(text)}`);
  };

  if (isLoading) {
    return (
      <div className="mt-8 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-5 text-stone-800">
          <Sparkles size={20} className="text-emerald-500" />
          <h2 className="text-xl font-semibold">Where to start?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 h-40 md:h-44 flex flex-col justify-between animate-pulse">
              <div className="w-24 h-3 bg-stone-100 rounded-full mb-4"></div>
              <div className="space-y-2.5 mb-auto">
                <div className="w-full h-3.5 bg-stone-100 rounded-full"></div>
                <div className="w-full h-3.5 bg-stone-100 rounded-full"></div>
                <div className="w-3/4 h-3.5 bg-stone-100 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no data returns, don't render the section
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      
      <div className="flex items-center gap-2 mb-5 text-stone-800">
        <Sparkles size={20} className="text-emerald-500" />
        <h2 className="text-xl font-semibold">Where to start?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(prompt.text)}
            className="group relative bg-white p-6 sm:p-7 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300 text-left flex flex-col justify-between h-40 md:h-44 overflow-hidden cursor-pointer"
          >
            {/* Background Hover Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-transparent to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 transition-colors group-hover:text-emerald-600">
                <span className="text-emerald-500">{getIcon(prompt.type)}</span>
                {prompt.type}
              </div>
              <p className="text-stone-700 font-medium leading-relaxed line-clamp-3 group-hover:text-stone-900 transition-colors">
                {prompt.text}
              </p>
            </div>
            
            <div className="absolute bottom-5 right-5 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-600 z-10">
              <ArrowRight size={20} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarterPrompts;