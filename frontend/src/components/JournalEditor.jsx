import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Sparkles, Save, Loader2 } from 'lucide-react';
//import useVisualViewport from '../hooks/useVisualViewport';
import api from '../services/api';

const JournalEditor = ({ initialContent, onSave, isSaving, journalId, onDraftCreated, onChange }) => {
  const [aiPrompt, setAiPrompt] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  //const viewportStyle = useVisualViewport();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
          blockquote: {
          HTMLAttributes: {
            // Tailwind classes to style the blockquote injected by the AI
            class: 'border-l-4 border-emerald-400 pl-5 py-2 my-6 bg-emerald-50/50 rounded-r-xl italic text-stone-700 shadow-sm',
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        // We apply font-serif (Merriweather) purely to the text area for that classic journal feel
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[45vh] md:min-h-[55vh] text-stone-800 font-serif leading-relaxed mb-24 md:mb-0 placeholder:text-stone-300',
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
      
      {/* NEW PLACEMENT: Top Action Bar 
        This flows naturally in the document, avoiding all mobile keyboard 
        and bottom-nav overlap issues.
      */}
      <div className="flex flex-row items-center justify-end gap-3 mb-4 sm:mb-6">
        <ActionButton 
          variant="secondary"
          icon={<Sparkles className="w-4 h-4 md:w-4 md:h-4 text-emerald-600" />} 
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
      <div className="bg-white rounded-4xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-100 grow mb-8">
        <EditorContent editor={editor} />
      </div>

      {/* AI RAG Insight Pop-up */}
      {aiPrompt && (
        <div className="mb-8 mx-2 md:mx-0 animate-fade-in-up">
           <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 relative shadow-sm">
              
              {/* Floating Badge */}
              <div className="absolute -top-3 left-6 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="text-emerald-600" />
                <span>Go Deeper</span>
              </div>
              
              <p className="text-stone-700 font-medium text-lg md:text-xl italic leading-relaxed font-serif mt-2">
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
                  className="text-sm font-semibold text-white bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm hover:shadow cursor-pointer"
                >
                  Insert to Journal
                </button>
                <button 
                  onClick={() => setAiPrompt(null)}
                  className="text-sm font-medium text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
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

// Reusable Action Button with visual variants
const ActionButton = ({ icon, label, onClick, loading, variant = "primary" }) => {
  const baseStyles = "flex items-center justify-center gap-2 rounded-full font-medium transition-all shadow-sm shrink-0 h-11 px-5 text-sm md:h-12 md:px-7 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95";
  
  const variants = {
    primary: "bg-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:bg-emerald-700 border border-transparent",
    secondary: "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:text-stone-900"
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