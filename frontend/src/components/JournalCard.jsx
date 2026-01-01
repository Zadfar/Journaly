import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Calendar, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';

const JournalCard = ({ entry, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

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

  // Format Date
  const dateStr = new Date(entry.created_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-[#2C4C3B]/10 hover:border-[#2C4C3B]/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-48">
      
      <Link to={`/journal/${entry.id}`} className='block h-full'>
        <div className="cursor-pointer space-y-3">
        
          {/* Header: Date & Mood */}
          <div className="flex items-center justify-between text-[#2C4C3B]/60 text-xs font-medium uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {dateStr}
            </div>
            {entry.mood_score && (
              <div className="flex items-center gap-1.5 bg-[#F3F0E7] px-2 py-1 rounded-full text-[#2C4C3B]">
                <Smile size={14} />
                <span>Mood: {entry.mood_score}/10</span>
              </div>
            )}
          </div>
          {/* AI Summary */}
          <p className="text-[#2C4C3B] font-medium leading-relaxed line-clamp-3">
            {entry.summary || entry.content_encrypted?.substring(0, 100) || "No summary available."}
          </p>
        
          {/* Tags */}
          {entry.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-[#228B22]/10 text-[#228B22] rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* --- ACTION MENU (Bottom Right) --- */}
      <div className="absolute bottom-4 right-4 z-10" ref={menuRef}>
        
        {/* Three Dots Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 rounded-full text-[#2C4C3B]/40 hover:bg-[#F3F0E7] hover:text-[#2C4C3B] transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>

        {/* Floating Toolbar */}
        {showMenu && (
          <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-xl shadow-xl border border-[#2C4C3B]/10 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default JournalCard;