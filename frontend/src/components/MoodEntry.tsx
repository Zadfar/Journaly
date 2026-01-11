import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { UserAuth } from '../context/AuthContext';

const MoodEntry = () => {
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState(null);
  const { session } = UserAuth();

  const userId = session?.user?.id;

  const moodIcons = [
    { icon: "🙁", text: "Rough day", score: 1 },
    { icon: "😐", text: "Not good", score: 2 },
    { icon: "🙂", text: "Not bad", score: 3 },
    { icon: "😄", text: "Good", score: 4 },
    { icon: "🤗", text: "Great!", score: 5 },
  ];

  // 1. Check if user already logged today
  const { data: hasLoggedToday, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['moodStatus', 'today', userId],
    queryFn: async () => {
      const res = await api.get('/moods/today');
      return res.data;
    },
  });

  // 2. Mutation to save mood via FastAPI
  const mutation = useMutation({
    mutationFn: async (moodData : {score : any, text: any, icon: any}) => {
      // Matches the Pydantic MoodCreate schema: { score: int, label: str }
      const payload = { 
        score: moodData.score, 
        label: moodData.text 
      };
      const res = await api.post('/moods/', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodStatus'] });
    }
  });

  const handleMoodSelect = (index : any) => {
    setSelectedMood(index);
  };

  const handleSaveMood = () => {
    if (selectedMood === null) return;
    mutation.mutate(moodIcons[selectedMood]);
  };

  // --- Render States ---

  // State A: Loading initial status
  if (isLoadingStatus) {
    return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-[#2C4C3B]" />
        </div>
    )
  }

  // State B: Already logged today (or just finished logging)
  if (hasLoggedToday || mutation.isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-3 py-6 animate-in fade-in duration-500">
        <CheckCircle2 size={48} className="text-[#2C4C3B]" />
        <p className="text-[#2C4C3B] font-medium text-center">
          You've tracked your mood for today.<br/>
          <span className="text-sm opacity-70">Check the Insights tab for trends!</span>
        </p>
      </div>
    );
  }

  // State C: Input Form
  return (
    <div className="flex flex-col">
      {/* Mood Grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {moodIcons.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleMoodSelect(index)}
            className={`
              flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200
              ${selectedMood === index 
                ? 'bg-[#2C4C3B] text-white transform scale-105 shadow-md' 
                : 'hover:bg-[#2C4C3B]/10 text-[#2C4C3B]/70 hover:scale-105'
              }
            `}
          >
            <span className="text-3xl mb-1 filter drop-shadow-sm">{mood.icon}</span>
            <span className="text-[10px] font-medium leading-tight text-center">
              {mood.text}
            </span>
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <button
          onClick={handleSaveMood}
          disabled={selectedMood === null || mutation.isPending}
          className={`
            w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center
            ${selectedMood !== null 
              ? 'bg-[#2C4C3B] text-white shadow-lg hover:shadow-xl hover:bg-[#1e3629]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Log Mood"
          )}
        </button>
      </div>
    </div>
  );
};

export default MoodEntry;