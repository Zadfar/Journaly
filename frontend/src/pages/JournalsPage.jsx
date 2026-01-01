import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserAuth } from '../context/AuthContext';
import { Plus, PenLine } from 'lucide-react';
import JournalCard from '../components/JournalCard';
import api from '../services/api';

const JournalsPage = () => {
  const { session } = UserAuth();
  const queryClient = useQueryClient();
  const user = session?.user;

  // --- FETCH JOURNALS ---
  const { data: journals, isLoading, error } = useQuery({
    queryKey: ['journals', user?.id],
    queryFn: async () => {
      const { data } = await api.get('/journals/');
      return data;
    },
    refetchInterval: (data) => {
      if (!data || !Array.isArray(data)) {
        return false;
      }
      const isProcessing = data?.some(j => j.summary === "Generating summary...");
      return isProcessing ? 2000 : false;
    }
  });

  // --- DELETE JOURNAL ---
  const deleteMutation = useMutation({
    mutationFn: async (journalId) => {
      await api.delete(`/journals/${journalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journals']);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8 text-[#2C4C3B]/60">Loading your Journals...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading journals.</div>;
  

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C4C3B]">My Journals</h1>
        </div>

        <Link 
          to="/journal/new" 
          className="bg-[#228B22] text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-[#2C4C3B]/20 hover:bg-[#008000] hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Entry
        </Link>
      </div>

      {journals && journals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => (
            <JournalCard 
              key={journal.id} 
              entry={journal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#2C4C3B]/10 rounded-3xl">
          <div className="bg-[#F3F0E7] p-4 rounded-full mb-4">
            <PenLine size={32} className="text-[#2C4C3B]/40" />
          </div>
          <h3 className="text-xl font-semibold text-[#2C4C3B]">No entries yet</h3>
          <p className="text-[#2C4C3B]/60 max-w-sm mt-2 mb-6">
            Start your journey of self-reflection today.
          </p>
          <Link to="/new-entry" className="text-[#228B22] font-medium hover:underline">
            Create your first entry &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default JournalsPage;