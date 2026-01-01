import React from 'react';
import { Home, Book, User, Plus, LogOut, Lightbulb, Settings } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  const { signOut } = UserAuth();
  const navigate = useNavigate();
  

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("sign-out error", error);
      }
    }
32
  return (
    <div className="min-h-screen bg-[#F3F0E7] font-sans text-[#2C4C3B]">
      
      {/* =========================================
          DESKTOP SIDEBAR (Hidden on Mobile)
         ========================================= */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-[#2C4C3B]/10 px-4 py-6">
        <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-[#228B22] p-1.5 rounded-lg">
                <div className="w-5 h-5 bg-white rounded-full opacity-20"></div> 
            </div>
            <span className="text-2xl font-bold text-[#228B22]">Journaly</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
            <NavItem icon={<Home />} label="Home" to={"/home"} />
            <NavItem icon={<Book />} label="My Journals" to={"/journals"}/>
            <NavItem icon={<Lightbulb />} label="Insights" to={"/insights"}/>
            <NavItem icon={<User />} label="Profile" to={"/profile"}/>
        </nav>

        {/* Logout */}
        <button 
        className="flex items-center gap-3 px-4 py-3 text-[#2C4C3B]/60 hover:text-[#228B22] transition-colors"
        onClick={handleSignOut}
        >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
        </button>
      </aside>


      {/* Main Content*/}
      <main className="pt-10 pb-24 px-4 md:pt-8 md:px-8 md:ml-64 max-w-7xl mx-auto">
        {children}
      </main>


      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-[#2C4C3B]/10 pb-safe z-40">
        <div className="flex justify-around items-center h-16">
            <MobileNavItem icon={<Home />} label="Home" to={"/home"}/>
            <MobileNavItem icon={<Book />} label="Journal" to={"/journals"}/>
            
            <div className="-mt-8">
                <button className="bg-[#228B22] hover:bg-[#008000] text-white p-4 rounded-full shadow-xl shadow-[#228B22]/20 transition-transform active:scale-95">
                    <Plus size={24} />
                </button>
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
      `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        isActive 
          ? 'bg-[#228B22]/10 text-[#228B22] font-semibold'
          : 'text-[#2C4C3B]/70 hover:bg-[#F3F0E7]'         
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => 
      `flex flex-col items-center justify-center w-14 gap-1 ${
        isActive ? 'text-[#228B22]' : 'text-[#2C4C3B]/40'
      }`
    }
  >
    <div className="text-current">
        {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-[10px] font-medium">
        {label}
    </span>
  </NavLink>
);

export default AppLayout;