import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming you might route these later

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-stone-200 py-12 text-stone-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
                
                {/* Brand / Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="bg-emerald-50 p-2 rounded-xl flex items-center justify-center grayscale-20">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-xl font-serif font-semibold tracking-tight text-stone-800">
                        Journaly
                    </span>
                </div>
                
                {/* Links - Removed pipe separators in favor of clean spacing */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
                    <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-emerald-600 transition-colors">Contact Support</a>
                </div>
                
                {/* Copyright */}
                <p className="text-sm font-light text-stone-400">
                    © {currentYear} Journaly. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;