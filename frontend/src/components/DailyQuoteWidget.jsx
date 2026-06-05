import { useQuery } from '@tanstack/react-query';
import { Quote } from 'lucide-react';
import api from '../services/api';

const DailyQuoteWidget = () => {
  
  const { data: quote, isLoading, isError} = useQuery({
    queryKey: ['dailyQuote'],
    queryFn: async () => {
      const res = await api.get('/quotes/daily');
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour on client side
  });

  return (
    <div className="bg-stone-900 text-stone-50 p-8 rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col justify-between w-full h-full min-h-56">
      
      {/* Background Decoration Icon */}
      <Quote className="absolute -top-2 -right-2 text-stone-800/80 w-24 h-24 pointer-events-none rotate-12" />

      {/* Header */}
      <div className="relative z-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-6">
          Daily Inspiration
        </h2>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
             <div className="h-4 bg-stone-800 rounded-md w-11/12"></div>
             <div className="h-4 bg-stone-800 rounded-md w-full"></div>
             <div className="h-4 bg-stone-800 rounded-md w-3/4 mb-4"></div>
             <div className="h-3 bg-stone-800 rounded-md w-1/3 mt-6"></div>
          </div>
        ) : isError ? (
          /* Error / Fallback State */
          <div className="animate-fade-in-up">
            <p className="text-lg font-light italic leading-relaxed text-stone-100">
              "The only journey is the one within."
            </p>
            <p className="mt-5 text-xs font-medium uppercase tracking-widest text-stone-400">
              — Rainer Maria Rilke
            </p>
          </div>
        ) : (
          /* Success State */
          <div className="animate-fade-in-up">
            <p className="text-lg font-light italic leading-relaxed text-stone-100">
              "{quote.quote}"
            </p>
            <p className="mt-5 text-xs font-medium uppercase tracking-widest text-stone-400">
              — {quote.author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuoteWidget;