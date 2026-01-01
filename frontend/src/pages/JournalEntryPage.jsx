import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import JournalEditor from '../components/JournalEditor';
import { ArrowLeft } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const JournalEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [isChanged, setIsChanged] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  const isSavingRef = useRef(false);

  const { data: journal, isLoading } = useQuery({
    queryKey: ['journal', id],
    queryFn: async () => {
      const res = await api.get(`/journals/${id}`);
      return res.data;
    },
    enabled: isEditMode, // Don't fetch if creating new
    onSuccess: (data) => setCurrentContent(data.content || ''),
  });

  // 2. Handles both Create and Update
  const saveMutation = useMutation({
    mutationFn: async (content) => {
      const payload = { content, mood_score: 7 }; // Hardcoded mood for now
      isSavingRef.current = true;
      
      if (isEditMode) {
        // UPDATE
        await api.put(`/journals/${id}`, payload);
      } else {
        // CREATE
        await api.post('/journals/', payload);
      }
    },
    onSuccess: () => {
      setIsChanged(false);
      queryClient.invalidateQueries(['journals']);
      if (blocker.state === "blocked") {
        blocker.proceed();
      } 
      else {
        navigate('/journals');
      }
    },
    onError: () => {
      // If save FAILS, revoke the pass so the user is blocked again
      isSavingRef.current = false;
      alert("Failed to save. Please try again.");
    }
  });

  // --- 3. NAVIGATION BLOCKER (The Core Logic) ---
  
  // A. Block React Router Navigation (Navbar, Links, Back Button)
  // Condition: Block if form is dirty AND we are not currently submitting
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isChanged && !isSavingRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  // B. Block Browser Tab Closing (Refresh / Close Window)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = ''; // Trigger browser's native "Are you sure?" dialog
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isChanged]);

  // --- 4. HANDLERS ---
  
  const handleEditorChange = (newContent) => {
    setCurrentContent(newContent);
    
    // Check if truly changed from initial
    // (If creating new, any text > 0 is dirty. If editing, compare with DB content)
    const initial = journal?.content || '';
    if (newContent !== initial) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleManualBack = () => {
    // Our custom Back Arrow button
    navigate('/journals'); 
  };

  const confirmSave = () => {
    // User chose "Save & Exit"
    saveMutation.mutate(currentContent);
    // Note: blocker.proceed() is not needed here because onSuccess triggers navigation,
    // and we set isChanged(false) in onSuccess, allowing it to pass.
  };

  const confirmDiscard = () => {
    // User chose "Discard"
    if (blocker.state === "blocked") {
      blocker.proceed(); // Let the navigation happen
    } else {
      // Fallback for manual button clicks if blocker wasn't triggered
      setIsChanged(false);
      navigate('/journals');
    }
  };

  const cancelNavigation = () => {
    // User chose "Cancel"
    if (blocker.state === "blocked") {
      blocker.reset(); // Stay on page
    }
  };

  if (isEditMode && isLoading) {
  return (
    <div className="max-w-4xl pb-20 animate-pulse">
      {/* Fake Header */}
      <div className="flex gap-4 mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
      </div>
      {/* Fake Editor Box */}
      <div className="bg-gray-100 rounded-3xl h-[60vh] w-full"></div>
    </div>
  );
}

  return (
    <>
    <div className="max-w-4xl pb-20">
      <div className="mb-6 flex gap-8">
        <div className='ml-2 bg-white rounded-3xl h-8 w-8 mt-0.5'>
          <button 
            className='outline-none bg-transparent text-gray-800 pl-1 pt-1 cursor-pointer'
            onClick={handleManualBack}
          >
            <ArrowLeft />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[#2C4C3B] text-center">
          {isEditMode ? 'Edit Entry' : 'New Entry'}
        </h1>
      </div>

      <JournalEditor 
        initialContent={journal?.content} 
        onChange={handleEditorChange}
        onSave={(content) => saveMutation.mutate(content)}
        isSaving={saveMutation.isPending}
        journalId={journal?.id}
      />
    </div>
    <ConfirmModal 
      isOpen={blocker.state === "blocked"}
      title="Unsaved Changes"
      message="You have unsaved thoughts. Do you want to save them before you leave?"
      onConfirm={confirmSave}
      onDiscard={confirmDiscard}
      onCancel={cancelNavigation}
      isSaving={saveMutation.isPending}
    />
    </>
  );
};

export default JournalEntryPage;