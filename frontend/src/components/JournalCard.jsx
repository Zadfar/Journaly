import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

// Refined, softer color palette for moods
const moodConfig = {
  1: {
    emoji: '😞',
    label: 'Rough',
    bg: 'bg-rose-50 border-rose-100',
    text: 'text-rose-600'
  },
  2: {
    emoji: '😕',
    label: 'Low',
    bg: 'bg-orange-50 border-orange-100',
    text: 'text-orange-600'
  },
  3: {
    emoji: '😐',
    label: 'Neutral',
    bg: 'bg-amber-50 border-amber-100',
    text: 'text-amber-600'
  },
  4: {
    emoji: '🙂',
    label: 'Positive',
    bg: 'bg-teal-50 border-teal-100',
    text: 'text-teal-600'
  },
  5: {
    emoji: '😄',
    label: 'Great',
    bg: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-600'
  }
};

const JournalCard = ({ entry, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const mood = moodConfig[entry.mood_score];
  const isGenerating = entry.summary === "Generating summary...";

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Date (e.g., "Mon, Oct 12")
  const dateStr = new Date(entry.created_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return (
    <div className="group relative bg-white rounded-3xl p-6 border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300 flex flex-col justify-between h-64">
      
      <Link to={`/journal/${entry.id}`} className="h-full flex flex-col justify-between cursor-pointer">
        <div className="space-y-4">
        
          {/* Header: Date & Mood */}
          <div className="flex items-center justify-between text-stone-400 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="mb-0.5" />
              {dateStr}
            </div>
            {entry.mood_score && mood && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${mood.bg} ${mood.text} capitalize tracking-normal text-xs font-medium`}
              >
                <span className="text-[14px]">{mood.emoji}</span>
                <span>{mood.label}</span>
              </div>
            )}
          </div>

          {/* AI Summary (or Content Fallback) */}
          <p className={`font-medium leading-relaxed line-clamp-4 transition-colors duration-300
            ${isGenerating 
                ? 'text-stone-400 italic animate-pulse' 
                : 'text-stone-700 group-hover:text-stone-900'}
          `}>
            {entry.summary || entry.content_encrypted?.substring(0, 120) || "No content recorded."}
          </p>
        </div>
        
        {/* Footer: Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 relative z-0">
          {entry.tags && entry.tags.length > 0 ? (
            entry.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[10px] font-semibold px-2.5 py-1 bg-stone-50 border border-stone-100 text-stone-500 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                #{tag}
              </span>
            ))
          ) : (
            // Invisible spacer to maintain layout if no tags
            <span className="text-[10px] px-2.5 py-1 opacity-0">#spacer</span>
          )}
        </div>
      </Link>

      {/* --- ACTION MENU (Bottom Right) --- */}
      <div className="absolute bottom-5 right-5 z-10" ref={menuRef}>
        
        {/* Three Dots Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-2 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
          aria-label="Journal options"
        >
          <MoreHorizontal size={20} />
        </button>

        {/* Floating Toolbar */}
        {showMenu && (
          <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-stone-100 overflow-hidden z-20 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              Delete Entry
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default JournalCard;