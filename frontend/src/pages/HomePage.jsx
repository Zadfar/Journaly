import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import MoodEntry from '../components/MoodEntry';
import DailyQuoteWidget from '../components/DailyQuoteWidget';
import StarterPrompts from '../components/StarterPrompts';

const HomePage = () => {
  const { session } = UserAuth();

  // Extract just the first name for a more personal, friendly greeting
  const fullName = session?.user?.identities?.[0]?.identity_data?.full_name;
  const userName = fullName ? fullName.split(' ')[0] : 'Friend';

  // Dynamic time-based greeting
  const [greeting, setGreeting] = useState('Good Morning');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto pb-12 w-full transition-colors duration-300">
      
      {/* 1. Header Section */}
      <div className="pt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 tracking-tight transition-colors">
          {greeting}, {userName}.
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2 font-light text-lg transition-colors">
          Ready to reflect on your day?
        </p>
      </div>

      {/* 2. The Dashboard Grid (Bento Box Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Card: Mood Tracker */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-8 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300">
           <h2 className="text-xl font-semibold mb-6 text-stone-800 dark:text-stone-100 transition-colors">
             How are you feeling today?
           </h2>
           <MoodEntry />
        </div>

        {/* Side Widget: Daily Quote */}
        <div className="lg:col-span-1 flex">
          <DailyQuoteWidget />
        </div>

      </div>
      
      {/* 3. AI Starter Prompts */}
      <div className="pt-2">
        <StarterPrompts />
      </div>
      
    </div>
  );
};

export default HomePage;