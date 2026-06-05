import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { UserAuth } from '../context/AuthContext';

const MoodCalendar = () => {
  const { session } = UserAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate Date Range for API
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  // Fetch extra to cover the full calendar grid (padding days)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Fetch Data
  const { data: moodHistory, isLoading } = useQuery({
    queryKey: ['moodHistory', session?.user.id, format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      const res = await api.get('/moods/history', {
        params: {
          start_date: calendarStart.toISOString(),
          end_date: calendarEnd.toISOString()
        }
      });
      return res.data;
    },
    enabled: !!session?.user.id
  });

  // Helper to get color based on score (With transparent "neon" dark mode variants)
  const getMoodColor = (score) => {
    switch(score) {
      case 1: return 'bg-rose-400 dark:bg-rose-500/20 text-white dark:text-rose-400 shadow-sm dark:shadow-none shadow-rose-200 border border-rose-300 dark:border-rose-500/30';
      case 2: return 'bg-orange-300 dark:bg-orange-500/20 text-stone-800 dark:text-orange-400 shadow-sm dark:shadow-none shadow-orange-200 border border-orange-200 dark:border-orange-500/30';
      case 3: return 'bg-amber-200 dark:bg-amber-500/20 text-stone-800 dark:text-amber-400 shadow-sm dark:shadow-none shadow-amber-200 border border-amber-300 dark:border-amber-500/30';
      case 4: return 'bg-teal-400 dark:bg-teal-500/20 text-white dark:text-teal-400 shadow-sm dark:shadow-none shadow-teal-200 border border-teal-300 dark:border-teal-500/30';
      case 5: return 'bg-emerald-500 dark:bg-emerald-500/20 text-white dark:text-emerald-400 shadow-sm dark:shadow-none shadow-emerald-200 border border-emerald-400 dark:border-emerald-500/30';
      default: return 'bg-stone-50 dark:bg-stone-800/50 border border-transparent hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-200 dark:hover:border-stone-700 text-stone-700 dark:text-stone-400';
    }
  };

  const getMoodTooltip = (score) => {
    const labels = ["", "Rough", "Low", "Neutral", "Positive", "Great"];
    return labels[score] || "";
  };

  // Generate Calendar Days
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none h-full flex flex-col justify-between transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight transition-colors">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1 bg-stone-50 dark:bg-stone-800 rounded-full border border-stone-100 dark:border-stone-700 p-1 transition-colors">
          <button onClick={prevMonth} className="p-1.5 hover:bg-white dark:hover:bg-stone-700 hover:shadow-sm dark:hover:shadow-none rounded-full transition-all cursor-pointer">
            <ChevronLeft size={18} className="text-stone-500 dark:text-stone-400" />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-white dark:hover:bg-stone-700 hover:shadow-sm dark:hover:shadow-none rounded-full transition-all cursor-pointer">
            <ChevronRight size={18} className="text-stone-500 dark:text-stone-400" />
          </button>
        </div>
      </div>

      {isLoading ? (
        // Skeleton Grid
        <div className="animate-pulse">
          <div className="grid grid-cols-7 mb-4">
             {weekDays.map(day => (
              <div key={day} className="h-3 bg-stone-100 dark:bg-stone-800 rounded mx-2 mb-2 transition-colors"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3">
             {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="flex justify-center">
                    <div className="h-10 w-10 bg-stone-50 dark:bg-stone-800/50 rounded-full transition-colors"></div>
                </div>
             ))}
          </div>
        </div>
      ) : (
        <>
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest transition-colors">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4">
            {days.map((day) => {
              const dayMood = moodHistory?.find((m) => 
                isSameDay(new Date(m.created_at), day)
              );

              return (
                <div key={day.toString()} className="group flex flex-col items-center">
                  <div 
                    className={`
                      h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 cursor-default
                      ${!isSameMonth(day, currentDate) ? 'opacity-30' : 'opacity-100'}
                      ${dayMood ? getMoodColor(dayMood.mood_score) : getMoodColor(null)}
                      ${dayMood ? 'group-hover:scale-110' : 'group-hover:scale-[1.05]'}
                    `}
                    title={dayMood ? `${getMoodTooltip(dayMood.mood_score)}` : ''}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Elegant Gradient Legend */}
      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 transition-colors">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2 transition-colors">
            <span>Rough</span>
            <span>Great</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-linear-to-r from-rose-400 via-amber-200 to-emerald-500 opacity-80 dark:opacity-60 transition-opacity"></div>
      </div>
      
    </div>
  );
};

export default MoodCalendar;