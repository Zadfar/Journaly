import { UserAuth } from '../context/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const ProfilePage = () => {
  const { session } = UserAuth();
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
      <div className="max-w-2xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium animate-fade-in-up">
        Error loading profile. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up w-full">
      
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-stone-800 tracking-tight">My Profile</h1>
        <p className="text-stone-500 mt-2 font-light text-lg">Manage your personal details.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-4xl border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
        
        {/* Soft Decorative Banner */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-emerald-50/80 to-transparent"></div>
        
        <div className="relative p-8 flex flex-col items-center text-center mt-8">
          
          {/* Avatar Container */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-stone-50 flex items-center justify-center relative z-10 transition-transform hover:scale-105 duration-300">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-stone-300" />
              )}
            </div>
          </div>

          {/* Name & Loading State */}
          {isLoading ? (
             <div className="h-8 w-48 bg-stone-100 rounded-lg animate-pulse mb-3"></div>
          ) : (
             <h2 className="text-2xl font-bold text-stone-800 mb-3 tracking-tight">
               {profile?.full_name || "Journaler"}
             </h2>
          )}
          
          {/* User Details */}
          <div className="flex flex-col gap-3 mt-1 items-center">
            
            <div className="flex items-center gap-2.5 text-stone-500 text-sm font-medium bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
              <Mail size={16} className="text-stone-400" />
              <span>{user?.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-500 text-sm">
              <Calendar size={16} className="text-stone-400" />
              {isLoading ? (
                  <div className="h-4 w-32 bg-stone-100 rounded animate-pulse"></div>
              ) : (
                  <span className="font-light">Joined {joinedDate}</span>
              )}
            </div>
            
          </div>

          {/* Action Button */}
          <button className="mt-8 px-8 py-2.5 rounded-full border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 transition-all duration-200 shadow-sm hover:shadow cursor-pointer">
            Edit Profile
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;