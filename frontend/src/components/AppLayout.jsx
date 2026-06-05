import React from 'react';
import { Home, Book, User, Plus, LogOut, Lightbulb, Leaf, Moon, Sun } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { UseTheme } from '../context/ThemeContext'; // <-- Import Theme Context

const AppLayout = ({ children }) => {
  const { signOut } = UserAuth();
  const { isDark, toggleTheme } = UseTheme(); // <-- Hook into theme state
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("sign-out error", error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-800 dark:text-stone-100 selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-300">
      
      {/* Desktop Nav */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800 px-4 py-6 z-50 transition-colors duration-300">
        
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-2.5 mb-10 px-2 transition-transform hover:scale-[1.02]">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-xl flex items-center justify-center transition-colors">
                <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            </div>
            <span className="text-2xl font-serif font-semibold tracking-tight text-stone-800 dark:text-stone-100 transition-colors">Journaly</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
            <NavItem icon={<Home />} label="Home" to={"/home"} />
            <NavItem icon={<Book />} label="My Journals" to={"/journals"}/>
            <NavItem icon={<Lightbulb />} label="Insights" to={"/insights"}/>
            <NavItem icon={<User />} label="Profile" to={"/profile"}/>
        </nav>

        {/* --- DESKTOP THEME TOGGLE --- */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3.5 mb-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-200 cursor-pointer"
        >
            {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout */}
        <button 
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
          onClick={handleSignOut}
        >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="pt-8 pb-28 px-4 md:pt-10 md:px-8 md:ml-64 max-w-7xl mx-auto min-h-screen flex flex-col">
        {children}
      </main>

      {/* Mobile Nav (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-t border-stone-100 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="flex justify-around items-center h-16 px-2">
            <MobileNavItem icon={<Home />} label="Home" to={"/home"}/>
            <MobileNavItem icon={<Book />} label="Journal" to={"/journals"}/>
            
            {/* Center Floating Action Button (FAB) */}
            <div className="-mt-8">
                <Link to="/journal/new">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer">
                      <Plus size={24} />
                  </button>
                </Link>
            </div>

            <MobileNavItem icon={<Lightbulb />} label="Insights" to={"/insights"}/>
            <MobileNavItem icon={<User />} label="Profile" to={"/profile"}/>
        </div>
      </nav>

    </div>
  );
};

// --- Helper Components ---

const NavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm'
          : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-stone-100'         
      }`
    }
  >
    {React.cloneElement(icon, { size: 20 })}
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `flex flex-col items-center justify-center w-14 gap-1.5 transition-colors ${
        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
      }`
    }
  >
    <div className="text-current transition-transform duration-200 active:scale-95">
        {React.cloneElement(icon, { size: 22 })}
    </div>
    <span className="text-[10px] font-medium tracking-wide">
        {label}
    </span>
  </NavLink>
);

export default AppLayout;