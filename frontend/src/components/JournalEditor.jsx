import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import api from '../services/api';

const JournalEditor = ({ initialContent, onSave, isSaving, journalId, onDraftCreated, onChange }) => {
  const [aiPrompt, setAiPrompt] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
          blockquote: {
          HTMLAttributes: {
            // Added dark mode classes for the injected AI blockquote
            class: 'border-l-4 border-emerald-400 dark:border-emerald-500/50 pl-5 py-2 my-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-r-xl italic text-stone-700 dark:text-stone-300 shadow-sm dark:shadow-none transition-colors duration-300',
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        // Added dark:prose-invert so Tailwind Typography handles inner elements like <strong> perfectly
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[45vh] md:min-h-[55vh] text-stone-800 dark:text-stone-100 font-serif leading-relaxed mb-24 md:mb-0 placeholder:text-stone-300 dark:placeholder:text-stone-600 transition-colors duration-300',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (onChange) {
        onChange(content);
      }
    },
  });

  const handleGoDeeper = async () => {
    const text = editor.getText();
    if (text.length < 20) return alert("Write a little more first so the AI can understand your thoughts!");

    setIsAnalyzing(true);
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
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (editor && initialContent) {
      if (editor.isEmpty) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  const handleSaveClick = () => {
    const content = editor.getHTML();
    onSave(content);
  };

  return (
    <div className="w-full relative flex flex-col grow">
      
      {/* Top Action Bar */}
      <div className="flex flex-row items-center justify-end gap-3 mb-4 sm:mb-6">
        <ActionButton 
          variant="secondary"
          icon={<Sparkles className="w-4 h-4 md:w-4 md:h-4 text-emerald-600 dark:text-emerald-500" />} 
          label="Go Deeper"
          onClick={handleGoDeeper}
          loading={isAnalyzing}
        />

        <ActionButton
          variant="primary"
          icon={<Save className="w-4 h-4 md:w-4 md:h-4" />}
          label="Save Entry" 
          onClick={handleSaveClick} 
          loading={isSaving}
        />
      </div>

      {/* Editor Canvas */}
      <div className="bg-white dark:bg-stone-900 rounded-4xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none border border-stone-100 dark:border-stone-800 grow mb-8 transition-colors duration-300">
        <EditorContent editor={editor} />
      </div>

      {/* AI RAG Insight Pop-up */}
      {aiPrompt && (
        <div className="mb-8 mx-2 md:mx-0 animate-fade-in-up">
           <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-3xl p-6 sm:p-8 relative shadow-sm dark:shadow-none transition-colors duration-300">
              
              {/* Floating Badge */}
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
                    editor.chain().focus()
                      .insertContent([
                        {
                          type: 'blockquote',
                          content: [
                            {
                              type: 'paragraph',
                              content: [
                                { type: 'text', text: '✨ Reflection: ', marks: [{ type: 'bold' }] },
                                { type: 'text', text: aiPrompt }
                              ]
                            }
                          ]
                        },
                        { type: 'paragraph' }
                      ])
                      .run();
                    setAiPrompt(null);
                  }}
                  className="text-sm font-semibold text-white bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm dark:shadow-none hover:shadow cursor-pointer"
                >
                  Insert to Journal
                </button>
                <button 
                  onClick={() => setAiPrompt(null)}
                  className="text-sm font-medium text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Reusable Action Button with visual variants (Updated for Dark Mode)
const ActionButton = ({ icon, label, onClick, loading, variant = "primary" }) => {
  const baseStyles = "flex items-center justify-center gap-2 rounded-full font-medium transition-all shadow-sm shrink-0 h-11 px-5 text-sm md:h-12 md:px-7 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95";
  
  const variants = {
    primary: "bg-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] dark:shadow-[0_4px_14px_0_rgba(16,185,129,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] dark:hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-700 border border-transparent",
    secondary: "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${loading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
    >
      {loading ? (
        <span className="animate-spin border-2 border-current border-t-transparent rounded-full w-4 h-4" />
      ) : icon}
      <span>{label}</span>
    </button>
  );
};

export default JournalEditor;