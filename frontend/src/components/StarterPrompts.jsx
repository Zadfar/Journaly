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
      case 'Reflection': return <Feather size={18} />;
      case 'Action': return <Target size={18} />;
      default: return <Lightbulb size={18} />;
    }
  };

  const handlePromptClick = (text) => {
    // Navigate to new journal with the prompt encoded in URL
    navigate(`/journal/new?prompt=${encodeURIComponent(text)}`);
  };

  if (isLoading) return <div className="h-32 animate-pulse bg-gray-100 rounded-3xl mt-8"></div>;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 text-[#2C4C3B]">
        <Sparkles size={20} />
        <h2 className="text-xl font-bold">Where to start?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(prompt.text)}
            className="group relative bg-white p-6 rounded-2xl border border-[#2C4C3B]/5 hover:border-[#2C4C3B]/20 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-32 md:h-40"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2C4C3B]/60 uppercase tracking-wide mb-2">
                {getIcon(prompt.type)}
                {prompt.type}
              </div>
              <p className="text-[#2C4C3B] font-medium leading-snug line-clamp-3">
                {prompt.text}
              </p>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#228B22]">
              <ArrowRight size={20} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarterPrompts;