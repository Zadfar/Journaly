import React from 'react';
import { Home, Book, User, Plus, LogOut, Lightbulb, Leaf } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  const { signOut } = UserAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("sign-out error", error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Desktop Nav */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-stone-100 px-4 py-6 z-50">
        
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-2.5 mb-10 px-2 transition-transform hover:scale-[1.02]">
            <div className="bg-emerald-50 p-2 rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-serif font-semibold tracking-tight text-stone-800">Journaly</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
            <NavItem icon={<Home />} label="Home" to={"/home"} />
            <NavItem icon={<Book />} label="My Journals" to={"/journals"}/>
            <NavItem icon={<Lightbulb />} label="Insights" to={"/insights"}/>
            <NavItem icon={<User />} label="Profile" to={"/profile"}/>
        </nav>

        {/* Logout */}
        <button 
          className="flex items-center gap-3 w-full px-4 py-3.5 mt-auto rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          onClick={handleSignOut}
        >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
        </button>
      </aside>

      {/* Main Content */}
      {/* The background here is handled by the wrapper div, making the main content area breathe */}
      <main className="pt-8 pb-28 px-4 md:pt-10 md:px-8 md:ml-64 max-w-7xl mx-auto min-h-screen flex flex-col">
        {children}
      </main>

      {/* Mobile Nav (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-stone-100 pb-[env(safe-area-inset-bottom)] z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
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
          ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
          : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'         
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
        isActive ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
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