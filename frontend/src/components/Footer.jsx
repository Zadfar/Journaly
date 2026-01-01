import { Leaf } from 'lucide-react';

const Footer = () => {
    return (
        <>
        {/* Footer */}
        <footer className="bg-[#1A3326] text-[#F3F0E7]/60 py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-[#4F772D]" />
                <span className="text-xl font-bold text-[#F3F0E7]">Journaly</span>
            </div>
            <div className="flex gap-2 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <span>|</span>
                <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
            <p className="text-sm">© 2025 Journaly. All rights reserved.</p>
            </div>
        </footer>
        </>
    )
}

export default Footer