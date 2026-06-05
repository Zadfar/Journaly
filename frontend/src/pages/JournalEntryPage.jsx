import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useBlocker, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import JournalEditor from '../components/JournalEditor';
import { ArrowLeft } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const JournalEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const starterPrompt = searchParams.get('prompt');

  const starterPromptContent = starterPrompt ? {
    type: 'doc',
    content: [
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '✨ Prompt: ',
                marks: [{ type: 'bold' }]
              },
              {
                type: 'text',
                text: starterPrompt
              }
            ]
          }
        ]
      },
      {
        type: 'paragraph'
      }
    ]
  } : "";

  const [isChanged, setIsChanged] = useState(false);
  const [currentContent, setCurrentContent] = useState(starterPrompt);
  const [draftJournalId, setDraftJournalId] = useState(null);
  const [skipInitialFetch, setSkipInitialFetch] = useState(false);

  const effectiveJournalId = draftJournalId || id;
  const isEditMode = !!effectiveJournalId;

  const isSavingRef = useRef(false);
  const internalNavigationRef = useRef(false);

  const handleDraftCreated = (newId) => {
    setDraftJournalId(newId);
    setSkipInitialFetch(true);

    window.history.replaceState(
        {},
        '',
        `/journal/${newId}`
    );
  };

  const { data: journal, isLoading } = useQuery({
    queryKey: ['journal', effectiveJournalId],
    queryFn: async () => {
      const res = await api.get(`/journals/${effectiveJournalId}`);
      return res.data;
    },
    enabled: !!effectiveJournalId && !skipInitialFetch, // Don't fetch if creating new
    onSuccess: (data) => setCurrentContent(data.content || ''),
  });

  // Handles both Create and Update
  const saveMutation = useMutation({
    mutationFn: async (content) => {
      const payload = { content, mood_score: 3 }; // Hardcoded mood for now
      isSavingRef.current = true;

      if (effectiveJournalId) {
        await api.put(`/journals/${effectiveJournalId}`, payload);
      } else {
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

  // Condition: Block if form is dirty AND we are not currently submitting
  const blocker = useBlocker(
  ({ currentLocation, nextLocation }) =>
    isChanged &&
    !isSavingRef.current &&
    !internalNavigationRef.current &&
    currentLocation.pathname !== nextLocation.pathname
  );

  // Block Browser Tab Closing (Refresh / Close Window)
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

  // --- HANDLERS ---
  
  const handleEditorChange = (newContent) => {
    setCurrentContent(newContent);
    
    // Check if truly changed from initial
    const initial = journal?.content || '';
    if (newContent !== initial) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleManualBack = () => {
    navigate('/journals'); 
  };

  const confirmSave = () => {
    saveMutation.mutate(currentContent);
  };

  const confirmDiscard = async () => {
    if (draftJournalId) {
      try {
        await api.delete(`/journals/${draftJournalId}`)
      } catch (e) {
        console.error(e);
      }
    }

    if (blocker.state === "blocked") {
      blocker.proceed(); // Let the navigation happen
    } else {
      setIsChanged(false);
      navigate('/journals');
    }
  };

  const cancelNavigation = () => {
    if (blocker.state === "blocked") {
      blocker.reset(); // Stay on page
    }
  };

  // Loading State
  if (isEditMode && isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-20 animate-fade-in-up w-full flex flex-col h-[80vh]">
        {/* Skeleton header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <div className="w-11 h-11 bg-stone-100 rounded-full animate-pulse border border-stone-200"></div>
          <div className="h-8 w-40 bg-stone-100 rounded-full animate-pulse"></div>
        </div>
        {/* Skeleton Editor Box */}
        <div className="bg-white border border-stone-100 rounded-4xl grow w-full animate-pulse shadow-sm"></div>
      </div>
    );
  }

  return (
    <>
    {/* Setting flex layout so the editor component can stretch to fill the screen */}
    <div className="max-w-4xl mx-auto pb-12 w-full animate-fade-in-up flex flex-col min-h-[85vh]">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button 
          className="p-2.5 bg-white border border-stone-200 text-stone-500 rounded-full hover:bg-stone-50 hover:text-stone-800 transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
          onClick={handleManualBack}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          {isEditMode ? 'Edit Entry' : 'New Entry'}
        </h1>
      </div>

      {/* Editor Container */}
      <div className="grow flex flex-col">
        <JournalEditor 
          initialContent={journal?.content ?? starterPromptContent} 
          onChange={handleEditorChange}
          onSave={(content) => saveMutation.mutate(content)}
          isSaving={saveMutation.isPending}
          journalId={effectiveJournalId}
          onDraftCreated={handleDraftCreated}
        />
      </div>
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