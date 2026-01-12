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
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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

  // Helper to get color based on score
  const getMoodColor = (score) => {
    switch(score) {
      case 1: return 'bg-[#cf3933]'; // (Rough)
      case 2: return 'bg-[#ff9a1d]'; // (Not Good)
      case 3: return 'bg-[#91d1d2]'; // (Neutral)
      case 4: return 'bg-[#8cc685]'; // (Good)
      case 5: return 'bg-[#fede50]'; // (Great)
      default: return 'bg-gray-100';
    }
  };

  const getMoodTooltip = (score) => {
    const labels = ["", "Rough", "Not Good", "Okay", "Good", "Great!"];
    return labels[score] || "";
  };

  // 4. Generate Calendar Days
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#2C4C3B]/10 shadow-sm h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#2C4C3B]">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-[#2C4C3B]" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={20} className="text-[#2C4C3B]" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#2C4C3B]" />
        </div>
      ) : (
        <>
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-4">
            {days.map((day) => {
              // Find mood for this specific day
              const dayMood = moodHistory?.find((m) => 
                isSameDay(new Date(m.created_at), day)
              );

              return (
                <div key={day.toString()} className="flex flex-col items-center">
                  <div 
                    className={`
                      h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300
                      ${!isSameMonth(day, currentDate) ? 'text-gray-300' : 'text-gray-700'}
                      ${dayMood ? `${getMoodColor(dayMood.mood_score)} text-white shadow-md scale-105` : 'hover:bg-gray-50'}
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

      {/* Legend */}
      <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#cf3933]"></div> Rough
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#91d1d2]"></div> Okay
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#fede50]"></div> Great
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;