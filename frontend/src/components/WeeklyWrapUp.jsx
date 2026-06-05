import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Sparkles, Feather } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../services/api';

const WeeklyWrapUp = () => {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = Last Week

  const { data, isLoading } = useQuery({
    queryKey: ['weeklyWrapUp', weekOffset],
    queryFn: async () => {
      const res = await api.get(`/insights/weekly?offset=${weekOffset}`);
      return res.data;
    },
    keepPreviousData: true // Keeps old data visible while fetching new
  });

  const payload = data?.payload;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-4xl p-6 sm:p-10 border border-stone-100 dark:border-stone-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none relative overflow-hidden min-h-100 flex flex-col transition-colors duration-300">
      
      {/* Soft Magical Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-linear-to-b from-emerald-50/50 dark:from-emerald-900/20 to-transparent pointer-events-none transition-colors duration-300"></div>

      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-10 z-10 relative">
        <button 
          onClick={() => setWeekOffset(o => o + 1)} // Go further back
          className="p-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors cursor-pointer"
          aria-label="Previous week"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="text-center">
          <h2 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 transition-colors">
            Weekly Harvest
          </h2>
          {data ? (
            <p className="text-sm text-stone-500 dark:text-stone-400 font-medium transition-colors">
              {format(parseISO(data.week_start), 'MMM d')} - {format(parseISO(data.week_end), 'MMM d')}
            </p>
          ) : (
             <div className="h-5 w-24 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse mx-auto transition-colors"></div>
          )}
        </div>

        <button 
          onClick={() => setWeekOffset(o => Math.max(0, o - 1))} // Go forward (limit to 0)
          disabled={weekOffset === 0}
          className={`p-2 rounded-full transition-colors ${
            weekOffset === 0 
              ? 'text-stone-300 dark:text-stone-700 cursor-not-allowed' 
              : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-100 cursor-pointer'
          }`}
          aria-label="Next week"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        {isLoading ? (
          /* Skeleton Loader */
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse w-full max-w-2xl mx-auto">
            <div className="w-3/4 h-8 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors"></div>
            <div className="w-16 h-px bg-stone-200 dark:bg-stone-700 transition-colors"></div>
            <div className="space-y-3 w-full text-center flex flex-col items-center">
              <div className="w-full h-4 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors"></div>
              <div className="w-11/12 h-4 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors"></div>
              <div className="w-4/5 h-4 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors"></div>
            </div>
            <div className="w-full h-24 bg-stone-50 dark:bg-stone-800/50 rounded-2xl mt-4 transition-colors"></div>
          </div>
        ) : payload?.is_empty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-10 transition-colors">
             <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-full mb-4 transition-colors">
                <Feather className="text-stone-300 dark:text-stone-600" size={28} />
             </div>
             <p className="text-stone-600 dark:text-stone-300 font-medium text-lg transition-colors">Not enough ink spilled this week.</p>
             <p className="text-sm mt-2 text-stone-400 dark:text-stone-500 font-light transition-colors">
               Try writing a few more entries to unlock your personalized insights.
             </p>
          </div>
        ) : (
          /* The Weekly Wrap-up */
          <div className="space-y-8 animate-fade-in-up flex flex-col items-center max-w-3xl mx-auto w-full">
            
            {/* 1. Headline */}
            <div className="text-center px-4">
              <h1 className="text-2xl md:text-3xl font-serif text-stone-800 dark:text-stone-100 leading-tight italic transition-colors">
                "{payload.headline}"
              </h1>
            </div>

            {/* Elegant Divider */}
            <div className="w-12 h-px bg-stone-300 dark:bg-stone-700 transition-colors"></div>

            {/* 2. The Narrative */}
            <p className="text-stone-600 dark:text-stone-300 text-lg md:text-xl leading-relaxed font-light text-center px-2 sm:px-8 transition-colors">
              {payload.summary}
            </p>

            {/* 3. The Insight Card */}
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/80 dark:border-emerald-800/30 p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 w-full mt-4 shadow-sm dark:shadow-none hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)] dark:hover:shadow-[0_4px_20px_rgba(16,185,129,0.02)] transition-all duration-300">
              <div className="bg-white dark:bg-stone-800 p-2.5 rounded-xl shadow-sm border border-emerald-50 dark:border-emerald-900/50 shrink-0 transition-colors">
                <Sparkles className="text-emerald-500 dark:text-emerald-400" size={20} />
              </div>
              <div className="pt-0.5">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block mb-1.5 transition-colors">
                  Key Discovery
                </span>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium transition-colors">
                  {payload.pattern}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyWrapUp;