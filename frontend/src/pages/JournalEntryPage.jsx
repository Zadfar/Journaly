import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useBlocker, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import JournalEditor from '../components/JournalEditor';
import { ArrowLeft, Save, Sparkles, Loader2, Mic, MicOff } from 'lucide-react'; // Added Mic icons
import ConfirmModal from '../components/ConfirmModal';

const JournalEntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const starterPrompt = searchParams.get('prompt');
  const starterPromptContent = starterPrompt ? {
    type: 'doc', content: [{ type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '✨ Prompt: ', marks: [{ type: 'bold' }] }, { type: 'text', text: starterPrompt }] }] }, { type: 'paragraph' }]
  } : "";

  const [isChanged, setIsChanged] = useState(false);
  const [currentContent, setCurrentContent] = useState(starterPrompt);
  const [draftJournalId, setDraftJournalId] = useState(null);
  const [skipInitialFetch, setSkipInitialFetch] = useState(false);
  
  // States tied to Editor Cores
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false); // <-- NEW: Mic recording state
  const editorRef = useRef(null);

  const effectiveJournalId = draftJournalId || id;
  const isEditMode = !!effectiveJournalId;
  const isSavingRef = useRef(false);
  const internalNavigationRef = useRef(false);

  const handleDraftCreated = (newId) => {
    setDraftJournalId(newId);
    setSkipInitialFetch(true);
    window.history.replaceState({}, '', `/journal/${newId}`);
  };

  const { data: journal, isLoading } = useQuery({
    queryKey: ['journal', effectiveJournalId],
    queryFn: async () => {
      const res = await api.get(`/journals/${effectiveJournalId}`);
      return res.data;
    },
    enabled: !!effectiveJournalId && !skipInitialFetch,
    onSuccess: (data) => setCurrentContent(data.content || ''),
  });

  const saveMutation = useMutation({
    mutationFn: async (content) => {
      const payload = { content, mood_score: 3 }; 
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
      if (blocker.state === "blocked") blocker.proceed();
      else navigate('/journals');
    },
    onError: () => {
      isSavingRef.current = false;
      alert("Failed to save. Please try again.");
    }
  });

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isChanged && !isSavingRef.current && !internalNavigationRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isChanged]);

  const handleEditorChange = (newContent) => {
    setCurrentContent(newContent);
    const initial = journal?.content || '';
    setIsChanged(newContent !== initial);
  };

  const handleManualBack = () => navigate('/journals'); 
  const confirmSave = () => saveMutation.mutate(currentContent);
  const cancelNavigation = () => { if (blocker.state === "blocked") blocker.reset(); };

  const confirmDiscard = async () => {
    if (draftJournalId) {
      try { await api.delete(`/journals/${draftJournalId}`) } catch (e) { console.error(e); }
    }
    if (blocker.state === "blocked") blocker.proceed();
    else { setIsChanged(false); navigate('/journals'); }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-20 animate-fade-in-up w-full flex flex-col h-[80vh] transition-colors duration-300">
        <div className="flex items-center gap-4 mb-8 pt-4">
          <div className="w-11 h-11 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse border border-stone-200 dark:border-stone-700 transition-colors"></div>
          <div className="h-8 w-40 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse transition-colors"></div>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-4xl grow w-full animate-pulse shadow-sm dark:shadow-none transition-colors"></div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto pb-12 w-full animate-fade-in-up flex flex-col min-h-[85vh] transition-colors duration-300">
      
      {/* STICKY GLASS HEADER */}
      <div className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md pt-4 pb-4 mb-4 flex items-center justify-between transition-colors duration-300">
        
        {/* Left Elements */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-100 transition-all duration-200 shadow-sm dark:shadow-none hover:shadow cursor-pointer"
            onClick={handleManualBack}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 tracking-tight transition-colors">
            {isEditMode ? 'Edit Entry' : 'New Entry'}
          </h1>
        </div>

        {/* Right Elements */}
        <div className="flex items-center gap-2">
           {/* Go Deeper Button */}
           <button 
             onClick={() => editorRef.current?.triggerGoDeeper()}
             disabled={isAnalyzing}
             className="flex items-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-200 shadow-sm dark:shadow-none hover:shadow cursor-pointer disabled:opacity-50"
           >
             {isAnalyzing ? <Loader2 size={20} className="animate-spin text-emerald-600" /> : <Sparkles size={20} className="text-emerald-600 dark:text-emerald-500" />}
             <span className="hidden md:inline font-medium text-sm">Go Deeper</span>
           </button>
           
           {/* Save Button */}
           <button 
             onClick={() => editorRef.current?.triggerSave()}
             disabled={saveMutation.isPending}
             className="flex items-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-200 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] dark:shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] cursor-pointer disabled:opacity-50"
           >
             {saveMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
             <span className="hidden md:inline font-medium text-sm">Save Entry</span>
           </button>

           {/* NEW: Voice-to-Text Button (Mic Icon Only) */}
           <button 
             onClick={() => editorRef.current?.triggerVoice()}
             className={`p-2.5 rounded-full border transition-all duration-200 shadow-sm dark:shadow-none hover:shadow cursor-pointer ${
               isListening 
                 ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 animate-pulse' 
                 : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
             }`}
             aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
           >
             {isListening ? <MicOff size={20} /> : <Mic size={20} />}
           </button>
        </div>

      </div>

      {/* Editor Container */}
      <div className="grow flex flex-col">
        <JournalEditor 
          ref={editorRef}
          initialContent={journal?.content ?? starterPromptContent} 
          onChange={handleEditorChange}
          onSave={(content) => saveMutation.mutate(content)}
          journalId={effectiveJournalId}
          onDraftCreated={handleDraftCreated}
          onAnalyzingChange={setIsAnalyzing}
          onListeningChange={setIsListening} // <-- Connect micro-states
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