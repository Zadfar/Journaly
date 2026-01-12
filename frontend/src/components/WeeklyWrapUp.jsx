import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
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
    <div className="bg-[#F3F4F6] p-1 rounded-3xl">
      <div className="bg-white rounded-[20px] p-6 border border-[#2C4C3B]/10 shadow-sm relative overflow-hidden min-h-75">
        
        {/* Header & Navigation */}
        <div className="flex items-center justify-between mb-6 z-10 relative">
          <button 
            onClick={() => setWeekOffset(o => o + 1)} // Go further back
            className="p-2 hover:bg-gray-100 rounded-full text-[#2C4C3B]"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <h2 className="text-sm font-bold text-[#2C4C3B] uppercase tracking-widest">Weekly Summary</h2>
            {data && (
              <p className="text-xs text-gray-400">
                {format(parseISO(data.week_start), 'MMM d')} - {format(parseISO(data.week_end), 'MMM d')}
              </p>
            )}
          </div>

          <button 
            onClick={() => setWeekOffset(o => Math.max(0, o - 1))} // Go forward (limit to 0)
            disabled={weekOffset === 0}
            className={`p-2 rounded-full text-[#2C4C3B] ${weekOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <Loader2 className="animate-spin text-[#2C4C3B]" size={32} />
            <p className="text-sm text-[#2C4C3B] animate-pulse">Analyzing your week...</p>
          </div>
        ) : payload?.is_empty ? (
          <div className="text-center py-10 opacity-60">
             <p>Not enough ink spilled this week.</p>
             <p className="text-sm mt-2">Try writing more to unlock insights.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Headline */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif text-[#2C4C3B] leading-tight">
                "{payload.headline}"
              </h1>
            </div>

            <hr className="border-[#2C4C3B]/10 w-1/2 mx-auto" />

            {/* 2. The Narrative */}
            <p className="text-[#2C4C3B]/80 text-lg leading-relaxed font-light text-center">
              {payload.summary}
            </p>

            {/* 3. The Insight Card */}
            <div className="bg-[#2C4C3B]/5 p-4 rounded-xl flex items-start gap-3 mt-4">
              <Sparkles className="text-[#2C4C3B] shrink-0 mt-1" size={18} />
              <div>
                <span className="text-xs font-bold text-[#2C4C3B] uppercase tracking-wide">Discovery</span>
                <p className="text-sm text-[#2C4C3B]/90 mt-1">{payload.pattern}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyWrapUp;