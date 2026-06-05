import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserAuth } from '../context/AuthContext';
import { Plus, PenLine, Sparkles } from 'lucide-react';
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
    refetchInterval: (query) => {
      const journals = query.state.data;

      if (!journals || !Array.isArray(journals)) {
        return false;
      }

      // Check if any journal is currently having its summary generated
      const isProcessing = journals.some(
        j => j.summary === "Generating summary..."
      );

      return isProcessing ? 1000 : false;
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
    // We will keep the native confirm for now, but in the future, 
    // a custom modal here would look incredibly slick!
    if (window.confirm("Are you sure you want to delete this memory?")) {
      deleteMutation.mutate(id);
    }
  };

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium animate-fade-in-up mt-8">
        Error loading journals. Please refresh the page to try again.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 w-full animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">My Journals</h1>
        </div>

        <Link 
          to="/journal/new" 
          className="bg-emerald-600 text-white px-6 py-3.5 rounded-full font-medium shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          New Entry
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-stone-100 h-64 flex flex-col justify-between animate-pulse shadow-sm">
               <div>
                  <div className="w-1/3 h-3 bg-stone-100 rounded-full mb-6"></div>
                  <div className="w-3/4 h-5 bg-stone-100 rounded-full mb-4"></div>
                  <div className="space-y-2.5">
                    <div className="w-full h-3.5 bg-stone-100 rounded-full"></div>
                    <div className="w-full h-3.5 bg-stone-100 rounded-full"></div>
                    <div className="w-4/5 h-3.5 bg-stone-100 rounded-full"></div>
                  </div>
               </div>
               <div className="w-1/4 h-6 bg-stone-100 rounded-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : journals && journals.length > 0 ? (
        /* Grid of Journals */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {journals.map((journal) => (
            <JournalCard 
              key={journal.id} 
              entry={journal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-stone-100 border-dashed rounded-4xl shadow-sm mt-8">
          <div className="bg-emerald-50 p-5 rounded-2xl mb-5">
            <PenLine size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-stone-800 tracking-tight">No entries yet</h3>
          <p className="text-stone-500 font-light max-w-sm mt-2 mb-8 leading-relaxed">
            Your mind is a blank canvas. Start your journey of self-reflection today.
          </p>
          <Link 
            to="/journal/new" 
            className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors group"
          >
            Create your first entry 
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default JournalsPage;