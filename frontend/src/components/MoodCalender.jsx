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

  // Helper to get color based on score (Matching the JournalCard palette)
  const getMoodColor = (score) => {
    switch(score) {
      case 1: return 'bg-rose-400 text-white shadow-sm shadow-rose-200 border border-rose-300';
      case 2: return 'bg-orange-300 text-stone-800 shadow-sm shadow-orange-200 border border-orange-200';
      case 3: return 'bg-amber-200 text-stone-800 shadow-sm shadow-amber-200 border border-amber-300';
      case 4: return 'bg-teal-400 text-white shadow-sm shadow-teal-200 border border-teal-300';
      case 5: return 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 border border-emerald-400';
      default: return 'bg-stone-50 border border-transparent hover:bg-stone-100 hover:border-stone-200 text-stone-700';
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
    <div className="bg-white p-6 sm:p-8 rounded-4xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-stone-800 tracking-tight">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1 bg-stone-50 rounded-full border border-stone-100 p-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all cursor-pointer">
            <ChevronLeft size={18} className="text-stone-500" />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all cursor-pointer">
            <ChevronRight size={18} className="text-stone-500" />
          </button>
        </div>
      </div>

      {isLoading ? (
        // Skeleton Grid
        <div className="animate-pulse">
          <div className="grid grid-cols-7 mb-4">
             {weekDays.map(day => (
              <div key={day} className="h-3 bg-stone-100 rounded mx-2 mb-2"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3">
             {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="flex justify-center">
                    <div className="h-10 w-10 bg-stone-50 rounded-full"></div>
                </div>
             ))}
          </div>
        </div>
      ) : (
        <>
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
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
                      h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-sm font-medium transition-transform duration-200 cursor-default
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
      <div className="mt-8 pt-6 border-t border-stone-100">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            <span>Rough</span>
            <span>Great</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-linear-to-r from-rose-400 via-amber-200 to-emerald-500 opacity-80"></div>
      </div>
      
    </div>
  );
};

export default MoodCalendar;