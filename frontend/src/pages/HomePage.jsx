import React from 'react';
import { UserAuth } from '../context/AuthContext';
import MoodEntry from '../components/MoodEntry';

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
        <div className="bg-[#228B22] text-white p-6 rounded-3xl shadow-lg">
           <h2 className="text-2xl font-bold mb-2">Daily Quote</h2>
           <p className="italic opacity-90 pt-4">"The only journey is the one within."</p>
           <div className="pt-4">
              <p className="text-sm opacity-80">Mood Trend: +12%</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;