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
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import { UserAuth } from '../context/AuthContext';

const MoodChart = () => {
  const { session } = UserAuth();
  
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
  const chartData = rawData?.map((item: { created_at: string; }) => ({
    ...item,
    dateLabel: format(parseISO(item.created_at), 'd MMM'), // e.g. "12 Jan"
    fullDate: format(parseISO(item.created_at), 'PPP'),    // e.g. "Jan 12, 2026"
  }));

  if (isLoading) {
    return (
      <div className="h-full min-h-75 flex items-center justify-center bg-white rounded-3xl border border-[#2C4C3B]/10">
        <Loader2 className="animate-spin text-[#2C4C3B]" />
      </div>
    );
  }

  // Empty State
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-full min-h-75 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#2C4C3B]/10 p-6 text-center">
        <p className="text-[#2C4C3B]/60 font-medium">No mood data yet for this month.</p>
        <p className="text-sm text-gray-400 mt-1">Start logging your daily vibe!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#2C4C3B]/10 shadow-sm h-full flex flex-col recharts-temp">
      <h2 className="text-xl font-bold text-[#2C4C3B] mb-6">Mood Flow</h2>
      
      <div className="flex-1 min-h-62.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2C4C3B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2C4C3B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            <XAxis 
              dataKey="dateLabel" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              domain={[1, 5]} 
              axisLine={false} 
              tickLine={false} 
              ticks={[1, 2, 3, 4, 5]} 
              tickFormatter={(value) => {
                 const icons = ['', '🙁', '😐', '🙂', '😄', '🤗'];
                 return icons[value];
              }}
              width={40}
            />
            
            <Tooltip 
                cursor={{ stroke: '#2C4C3B', strokeWidth: 1, strokeDasharray: '5 5' }}
                contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: '1px solid rgba(44, 76, 59, 0.1)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: '#2C4C3B', fontWeight: 'bold' }}
                formatter={(value: any) => [ 
                // Show Label + Icon instead of just number
                `${["", "🙁", "😐", "🙂", "😄", "🤗"][value]} `, 
                "Mood Score"
                ]}
            />
            
            <Area 
              type="monotone" 
              dataKey="mood_score" 
              stroke="#2C4C3B" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMood)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;