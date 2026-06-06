import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Sparkles } from 'lucide-react';
import api from '../services/api';

const JournalEditor = forwardRef(({ 
  initialContent, 
  onSave, 
  journalId, 
  onDraftCreated, 
  onChange, 
  onAnalyzingChange,
  onListeningChange // <-- NEW: Prop to sync mic state up to header
}, ref) => {
  const [aiPrompt, setAiPrompt] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const aiPopupRef = useRef(null);
  const recognitionRef = useRef(null); // <-- NEW: Holds speech instance

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-emerald-400 dark:border-emerald-500/50 pl-5 py-2 my-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-r-xl italic text-stone-700 dark:text-stone-300 shadow-sm dark:shadow-none transition-colors duration-300',
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[45vh] md:min-h-[55vh] text-stone-800 dark:text-stone-100 font-serif leading-relaxed mb-24 md:mb-0 placeholder:text-stone-300 dark:placeholder:text-stone-600 transition-colors duration-300',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (onChange) onChange(content);
    },
  });

  // --- NEW: INITIALIZE VOICE TO TEXT CORES ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true; // Keeps listening even if user pauses speaking
      rec.interimResults = false; // Only commits text once sentences are fully distinct
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        onListeningChange?.(true);
      };

      rec.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      rec.onresult = (event) => {
        const currentResultIndex = event.resultIndex;
        const transcript = event.results[currentResultIndex][0].transcript;
        
        if (editor) {
          editor.commands.focus();
          // Seamlessly insert dictated text right where their cursor is positioned
          editor.commands.insertContent(transcript + ' ');
        }
      };

      recognitionRef.current = rec;
    }

    // Clean up microphone access instantly if page changes or components unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [editor, onListeningChange]);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not fully supported on this specific browser browser. Try Chrome or Safari!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleGoDeeper = async () => {
    const text = editor.getText();
    if (text.length < 20) return alert("Write a little more first so the AI can understand your thoughts!");

    onAnalyzingChange?.(true);
    setAiPrompt(null);

    try {
      const response = await api.post('/journals/deepen', {
        content: text,
        journal_id: journalId
      });

      const newJournalId = response.data.journal_id;
      if (!journalId && newJournalId) {
        onDraftCreated?.(newJournalId);
      }
      setAiPrompt(response.data.prompt);
    } catch (err) {
      console.error(err);
      alert("AI is taking a nap. Try again.");
    } finally {
      onAnalyzingChange?.(false);
    }
  };

  const handleSaveClick = () => {
    if (!editor) return;
    const content = editor.getHTML();
    onSave(content);
  };

  // Expose methods directly up to our header container
  useImperativeHandle(ref, () => ({
    triggerGoDeeper: handleGoDeeper,
    triggerSave: handleSaveClick,
    triggerVoice: handleVoiceToggle // <-- EXPOSE VOICE TOGGLE
  }));

  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (aiPrompt && aiPopupRef.current) {
      setTimeout(() => {
        aiPopupRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [aiPrompt]);

  return (
    <div className="w-full relative flex flex-col grow">
      <div className="bg-white dark:bg-stone-900 rounded-4xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none border border-stone-100 dark:border-stone-800 grow mb-8 transition-colors duration-300">
        <EditorContent editor={editor} />
      </div>

      {aiPrompt && (
        <div ref={aiPopupRef} className="mb-8 mx-2 md:mx-0 animate-fade-in-up">
           <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-3xl p-6 sm:p-8 relative shadow-sm dark:shadow-none transition-colors duration-300">
              <div className="absolute -top-3 left-6 bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm dark:shadow-none transition-colors">
                <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span>Go Deeper</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium text-lg md:text-xl italic leading-relaxed font-serif mt-2 transition-colors">
                "{aiPrompt}"
              </p>
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <button 
                  onClick={() => {
                    editor.chain().focus().insertContent([{ type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: '✨ Reflection: ', marks: [{ type: 'bold' }] }, { type: 'text', text: aiPrompt }] }] }, { type: 'paragraph' }]).run();
                    setAiPrompt(null);
                  }}
                  className="text-sm font-semibold text-white bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm dark:shadow-none hover:shadow cursor-pointer"
                >
                  Insert to Journal
                </button>
                <button onClick={() => setAiPrompt(null)} className="text-sm font-medium text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer">
                  Dismiss
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
});

JournalEditor.displayName = 'JournalEditor';
export default JournalEditor;