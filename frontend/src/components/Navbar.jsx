import { useState } from "react";
import { Leaf, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
    <>
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="bg-emerald-50 p-2 rounded-xl flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                    </div>
                    {/* Using font-serif here to give the branding a slightly premium, editorial feel */}
                    <span className="text-xl font-serif font-semibold tracking-tight text-stone-800">Journaly</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium">Features</a>
                <a href="#how-it-works" className="text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium">How it Works</a>
                <a href="#about" className="text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium">Our Mission</a>
                
                <div className="flex items-center gap-3 ml-2">
                    <Link to={"/login"}>
                        <button className="px-5 py-2.5 text-sm rounded-full text-stone-600 font-medium hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 cursor-pointer">
                            Log In
                        </button>
                    </Link>
                    <Link to={"/signup"}>
                        <button className="px-5 py-2.5 text-sm rounded-full bg-emerald-600 text-white font-medium shadow-[0_2px_10px_rgba(52,211,153,0.2)] hover:bg-emerald-700 hover:shadow-[0_4px_15px_rgba(52,211,153,0.3)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="p-2 text-stone-500 hover:text-stone-800 transition-colors rounded-lg hover:bg-stone-50 cursor-pointer"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                </div>
            </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
            <div className="md:hidden absolute w-full bg-white border-b border-stone-100 shadow-xl pb-6 pt-2 px-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                <div className="flex flex-col gap-2">
                <a 
                    href="#features" 
                    className="p-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Features
                </a>
                <a 
                    href="#how-it-works" 
                    className="p-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                >
                    How it Works
                </a>
                <a 
                    href="#about" 
                    className="p-3 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors font-medium mb-4"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Our Mission
                </a>
                
                <div className="flex flex-col gap-3">
                    <Link to={"/login"} className="w-full" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full py-3.5 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition-colors cursor-pointer">
                            Log In
                        </button>
                    </Link>
                    <Link to={"/signup"} className="w-full" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-colors cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </div>
                </div>
            </div>
            )}
        </nav>
    </>
  );
};

export default Navbar;