import { useQuery } from '@tanstack/react-query';
import { Quote, RefreshCw } from 'lucide-react';
import api from '../services/api';

const DailyQuoteWidget = () => {
  
  const { data: quote, isLoading, isError, refetch } = useQuery({
    queryKey: ['dailyQuote'],
    queryFn: async () => {
      const res = await api.get('/quotes/daily');
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour on client side
  });

  return (
    <div className="bg-[#228B22] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between h-full min-h-50">
      
      {/* Background Decoration Icon */}
      <Quote className="absolute top-3 right-3 text-white/10 w-16 h-16 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Daily Quote
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse opacity-50">
             <div className="h-4 bg-white/30 rounded w-3/4"></div>
             <div className="h-4 bg-white/30 rounded w-full"></div>
             <div className="h-4 bg-white/30 rounded w-1/2"></div>
          </div>
        ) : isError ? (
           <p className="italic opacity-90">"The only journey is the one within."</p>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-lg font-medium italic leading-relaxed opacity-95">
              "{quote.quote}"
            </p>
            <p className="mt-4 text-sm font-bold uppercase tracking-wide opacity-70">
              — {quote.author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuoteWidget;