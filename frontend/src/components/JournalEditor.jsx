import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Sparkles, Wand2 } from 'lucide-react';
import useVisualViewport from '../hooks/useVisualViewport';
import api from '../services/api';

const JournalEditor = ({ initialContent, onSave, isSaving, journalId, onChange }) => {
  const [aiPrompt, setAiPrompt] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const viewportStyle = useVisualViewport();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
          blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-[#228B22] pl-4 py-1 my-4 bg-[#228B22]/10 rounded-r-lg italic text-[#2C4C3B]',
          },
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] text-[#2C4C3B] mb-20 md:mb-0',
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
    if (text.length < 20) return alert("Write a little more first!");

    setIsAnalyzing(true);
    setAiPrompt(null);

    try {
      const response = await api.post('/journals/deepen', {
        content: text,
        journal_id: journalId
      });

      setAiPrompt(response.data.prompt);
      
      // If it was a new entry, we might need to update the URL (handled by parent usually, 
      // but for now let's just show the prompt)
      
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
    <div className="w-full max-w-4xl relative min-h-screen md:min-h-auto">
      
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#2C4C3B]/10">
        <EditorContent editor={editor} />
      </div>

      {aiPrompt && (
        <div className="mb-24 mx-4 md:mx-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
           <div className="bg-[#228B22]/5 border border-[#228B22]/20 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-6 bg-[#228B22] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={12} />
                <span>Insight</span>
              </div>
              
              <p className="text-[#2C4C3B] font-medium text-lg italic leading-relaxed">
                "{aiPrompt}"
              </p>

              <div className="mt-4 flex gap-3">
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
                  className="text-sm font-semibold text-[#228B22] hover:underline"
                >
                  Insert to Journal
                </button>
                <button 
                  onClick={() => setAiPrompt(null)}
                  className="text-sm text-[#2C4C3B]/50 hover:text-[#2C4C3B]"
                >
                  Dismiss
                </button>
              </div>
           </div>
        </div>
      )}

      <div 
        className="
          fixed left-0 right-0 z-50 px-4 py-3 transition-all duration-75
          bg-white/95 backdrop-blur-md border-t border-[#2C4C3B]/10
          
          md:static md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:mt-6
        "
        style={window.innerWidth < 768 ? viewportStyle : {}}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar md:flex-wrap py-2">
          
          <ActionButton 
            icon={<Sparkles className="w-4 h-4 md:w-5 md:h-5" />} 
            label="Go Deeper"
            onClick={handleGoDeeper}
            loading={isAnalyzing}
          />

          <ActionButton 
            icon={<Wand2 className="w-4 h-4 md:w-5 md:h-5" />} 
            label="Fix Grammar"
            onClick={() => {}}
          />

          <ActionButton
            label="Save Entry" 
            onClick={handleSaveClick} 
            loading={isSaving}
          />
          
        </div>
      </div>

    </div>
  );
};

const ActionButton = ({ icon, label, onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 rounded-full font-medium transition-all shadow-sm shrink-0
        h-10 px-4 text-xs cursor-pointer
        md:h-12 md:px-6 md:text-sm
      bg-[#228B22] text-white shadow-[#228B22]/20 active:bg-[#1a6b1a] 
      `}
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : icon}
      <span>{label}</span>
    </button>
  );
};

export default JournalEditor;