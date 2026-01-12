import React from 'react';
import { UserAuth } from '../context/AuthContext';
import MoodEntry from '../components/MoodEntry';
import DailyQuoteWidget from '../components/DailyQuoteWidget';

const HomePage = () => {
  const { session } = UserAuth();

  const userName = session?.user.identities[0].identity_data.full_name;

  return (
    <div className="space-y-8">
      
      {/* 1. Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#2C4C3B]">Good Morning, {userName}</h1>
        <p className="text-[#2C4C3B]/60">Ready to reflect on your day?</p>
      </div>

      {/* 2. The Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#2C4C3B]/5 shadow-sm">
           <h2 className="text-xl font-bold mb-4">How are you feeling Today?</h2>
           <MoodEntry />
        </div>

        {/* Side Widget */}
        <DailyQuoteWidget />

      </div>
    </div>
  );
};

export default HomePage;