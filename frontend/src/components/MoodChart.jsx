import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { UserAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';
import { UseTheme } from '../context/ThemeContext'; // <-- Import Theme Context

const MoodChart = () => {
  const { session } = UserAuth();
  const { isDark } = UseTheme(); // <-- Hook into theme state
  
  // Calculate range (Last 30 days or Current Month)
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate).toISOString();
  const endDate = endOfMonth(currentDate).toISOString();

  // Fetch Data
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['moodHistory', session?.user.id, 'chart'],
    queryFn: async () => {
      const res = await api.get('/moods/history', {
        params: { start_date: startDate, end_date: endDate }
      });
      return res.data;
    },
    enabled: !!session?.user.id
  });

  // Process data for Recharts
  const chartData = rawData?.map((item) => ({
    ...item,
    dateLabel: format(parseISO(item.created_at), 'd MMM'), // e.g. "12 Jan"
    fullDate: format(parseISO(item.created_at), 'PPP'),    // e.g. "Jan 12, 2026"
  }));

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none h-full min-h-75 flex flex-col transition-colors duration-300">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight mb-8 transition-colors">Mood Flow</h2>
        <div className="flex-1 animate-pulse flex flex-col justify-end gap-6 pb-6">
          <div className="w-full h-px bg-stone-100 dark:bg-stone-800 transition-colors"></div>
          <div className="w-full h-px bg-stone-100 dark:bg-stone-800 transition-colors"></div>
          <div className="w-full h-px bg-stone-100 dark:bg-stone-800 transition-colors"></div>
          <div className="w-full h-px bg-stone-100 dark:bg-stone-800 transition-colors"></div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none h-full min-h-75 flex flex-col transition-colors duration-300">
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight mb-4 transition-colors">Mood Flow</h2>
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-3xl p-6 text-center mt-2 transition-colors">
          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-full mb-4 transition-colors">
            <Activity size={28} className="text-stone-300 dark:text-stone-600" />
          </div>
          <p className="text-stone-600 dark:text-stone-300 font-medium transition-colors">No mood data yet.</p>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-1 font-light transition-colors">Start logging to see your emotional flow!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none h-full flex flex-col transition-colors duration-300">
      <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight mb-8 transition-colors">Mood Flow</h2>
      
      <div className="flex-1 min-h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                {/* Emerald-500 to transparent */}
                <stop offset="5%" stopColor="#10B981" stopOpacity={isDark ? 0.6 : 0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Conditional grid colors using the useTheme hook! */}
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#292524' : '#F5F5F4'} />
            
            <XAxis 
              dataKey="dateLabel" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#A8A29E', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              domain={[1, 5]} 
              axisLine={false} 
              tickLine={false} 
              ticks={[1, 2, 3, 4, 5]} 
              tickFormatter={(value) => {
                 const icons = ['', '🙁', '😕', '😐', '🙂', '😄'];
                 return icons[value];
              }}
              width={45}
              tick={{ fontSize: 16 }} // Make emojis slightly larger
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#10B981', strokeWidth: 2, strokeDasharray: '6 6', opacity: 0.5 }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="mood_score" 
              stroke="#10B981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorMood)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const icons = ['', '😞', '😕', '😐', '🙂', '😄'];
    
    return (
      <div className="bg-stone-900 dark:bg-stone-800 text-stone-50 p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-stone-800 dark:border-stone-700 transition-colors">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
          {data.fullDate}
        </p>
        <div className="flex items-center gap-2.5">
           <span className="text-2xl drop-shadow-sm">
             {icons[data.mood_score]}
           </span>
           <p className="font-semibold text-lg text-stone-100">
             {data.mood_label || "Logged Entry"}
           </p>
        </div>
      </div>
    );
  }
  return null;
};

export default MoodChart;