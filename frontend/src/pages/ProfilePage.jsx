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

  if (error) return <div>Error loading profile</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2C4C3B]">My Profile</h1>
        <p className="text-[#2C4C3B]/60">Manage your personal details.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#2C4C3B]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-[#228B22]/10"></div>
        <div className="relative flex flex-col items-center text-center">
          
          <div className="relative mb-6 group">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#F3F0E7] flex items-center justify-center">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-[#2C4C3B]/40" />
              )}
            </div>
          </div>

          {isLoading ? (
             <div className="h-8 w-48 bg-[#F3F0E7] rounded-lg animate-pulse mb-2"></div>
          ) : (
             <h2 className="text-2xl font-bold text-[#2C4C3B] mb-2">
               {profile?.full_name}
             </h2>
          )}
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-[#2C4C3B]/60 text-sm">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>

            <div className="flex items-center gap-2 text-[#2C4C3B]/60 text-sm">
              <Calendar size={16} />
              <span>Joined {joinedDate}</span>
            </div>
          </div>

          <button className="mt-8 px-6 py-2.5 border border-[#2C4C3B]/20 rounded-xl text-[#2C4C3B] font-semibold hover:bg-[#F3F0E7] transition-colors text-sm">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;