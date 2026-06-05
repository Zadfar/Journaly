import { UserAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Moon, Sun } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { UseTheme } from '../context/ThemeContext'; // Fixed capital U typo

const ProfilePage = () => {
  const { session } = UserAuth();
  const { isDark, toggleTheme } = UseTheme(); // Fixed capital U typo
  const user = session?.user;

  const fetchProfile = async () => {
    const { data } = await api.get('/profile/');
    return data;
  };

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: fetchProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const joinedDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '...';

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-500/20 text-center font-medium animate-fade-in-up transition-colors">
        Error loading profile. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up w-full transition-colors duration-300">
      
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight transition-colors">My Profile</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2 font-light text-lg transition-colors">Manage your personal details.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-stone-900 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none relative overflow-hidden transition-colors duration-300">
        
        {/* Soft Decorative Banner */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-emerald-50/80 dark:from-emerald-900/20 to-transparent transition-colors duration-300"></div>
        
        <div className="relative p-8 flex flex-col items-center text-center mt-8">
          
          {/* Avatar Container */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-stone-900 shadow-md overflow-hidden bg-stone-50 dark:bg-stone-800 flex items-center justify-center relative z-10 transition-all hover:scale-105 duration-300">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-stone-300 dark:text-stone-600" />
              )}
            </div>
          </div>

          {/* Name & Loading State */}
          {isLoading ? (
             <div className="h-8 w-48 bg-stone-100 dark:bg-stone-800 rounded-lg animate-pulse mb-3 transition-colors"></div>
          ) : (
             <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-3 tracking-tight transition-colors">
               {profile?.full_name || "Journaler"}
             </h2>
          )}
          
          {/* User Details */}
          <div className="flex flex-col gap-3 mt-1 items-center">
            
            <div className="flex items-center gap-2.5 text-stone-500 dark:text-stone-400 text-sm font-medium bg-stone-50 dark:bg-stone-800/50 px-4 py-2 rounded-full border border-stone-100 dark:border-stone-700/50 transition-colors">
              <Mail size={16} className="text-stone-400 dark:text-stone-500" />
              <span>{user?.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-500 dark:text-stone-400 text-sm transition-colors">
              <Calendar size={16} className="text-stone-400 dark:text-stone-500" />
              {isLoading ? (
                  <div className="h-4 w-32 bg-stone-100 dark:bg-stone-800 rounded animate-pulse transition-colors"></div>
              ) : (
                  <span className="font-light">Joined {joinedDate}</span>
              )}
            </div>
            
          </div>

          {/* Action Button */}
          <button className="mt-8 px-8 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-all duration-200 shadow-sm dark:shadow-none hover:shadow cursor-pointer">
            Edit Profile
          </button>
          
        </div>
      </div>

      {/* Settings Panel (Mobile Only) */}
      <div className="pt-4 md:hidden">
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 px-2 transition-colors">Settings</h3>
        
        <div className="bg-white dark:bg-stone-900 rounded-4xl border border-stone-100 dark:border-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none p-6 flex items-center justify-between transition-colors duration-300">  
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl transition-colors ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-stone-100 text-stone-600'}`}>
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-stone-800 dark:text-stone-100 transition-colors">Appearance</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-light mt-0.5 transition-colors">Toggle light or dark theme</p>
            </div>
          </div>
          
          {/* iOS Style Switch */}
          <button 
            onClick={toggleTheme} 
            className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none cursor-pointer shrink-0 ${isDark ? 'bg-emerald-500' : 'bg-stone-200'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;