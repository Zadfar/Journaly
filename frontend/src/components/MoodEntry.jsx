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
    mutationFn: async (moodData) => {
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

  const handleMoodSelect = (index) => {
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
        // min-h ensures the card doesn't collapse and jump during loading
        <div className="min-h-56 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500 h-8 w-8 mb-4" />
            <p className="text-stone-400 dark:text-stone-500 text-sm font-light animate-pulse transition-colors">Checking today's entry...</p>
        </div>
    )
  }

  // State B: Already logged today (or just finished logging)
  if (hasLoggedToday || mutation.isSuccess) {
    return (
      <div className="min-h-56 flex flex-col items-center justify-center space-y-4 animate-fade-in-up">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-full mb-2 transition-colors duration-300">
            <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-center space-y-1">
            <p className="text-stone-800 dark:text-stone-100 font-medium text-lg transition-colors">
            Mood logged for today.
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-light transition-colors">
            Check the Insights tab for trends!
            </p>
        </div>
      </div>
    );
  }

  // State C: Input Form
  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* Mood Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-8">
        {moodIcons.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleMoodSelect(index)}
            className={`
              group flex flex-col items-center justify-center p-3 sm:py-4 rounded-[1.25rem] transition-all duration-300
              ${selectedMood === index 
                ? 'bg-white dark:bg-stone-800 border-2 border-emerald-500 shadow-[0_4px_15px_rgba(16,185,129,0.15)] transform scale-[1.03]' 
                : 'bg-stone-50 dark:bg-stone-800/50 border-2 border-transparent hover:bg-stone-100 dark:hover:bg-stone-700 hover:scale-[1.03] cursor-pointer'
              }
            `}
          >
            {/* The group-hover scales the emoji up slightly when hovering over the button box */}
            <span className="text-3xl sm:text-4xl mb-2 filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                {mood.icon}
            </span>
            <span className={`text-[10px] sm:text-xs font-medium leading-tight text-center transition-colors duration-300
                ${selectedMood === index ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`
            }>
              {mood.text}
            </span>
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={handleSaveMood}
          disabled={selectedMood === null || mutation.isPending}
          className={`
            w-full py-3.5 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center
            ${selectedMood !== null 
              ? 'bg-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 hover:bg-emerald-700 cursor-pointer' 
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed'
            }
          `}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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