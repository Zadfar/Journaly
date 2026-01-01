import React from 'react';

const HomePage = () => {
  return (
    <div className="space-y-8">
      
      {/* 1. Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#2C4C3B]">Good Morning, Alex</h1>
        <p className="text-[#2C4C3B]/60">Ready to reflect on your day?</p>
      </div>

      {/* 2. The Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Card: Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#2C4C3B]/5 shadow-sm">
           <h2 className="text-xl font-bold mb-4">Recent Entries</h2>
           {/* ... List of entries ... */}
           <div className="h-40 bg-[#F3F0E7] rounded-xl flex items-center justify-center text-[#2C4C3B]/40">
              Placeholder for Entry List
           </div>
        </div>

        {/* Side Widget: Takes up 1 column on large screens, stacks on mobile */}
        <div className="bg-[#228B22] text-white p-6 rounded-3xl shadow-lg">
           <h2 className="text-xl font-bold mb-2">Daily Quote</h2>
           <p className="italic opacity-90">"The only journey is the one within."</p>
           <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-80">Mood Trend: +12%</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;