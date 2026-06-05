import React from 'react';
import { BookHeart, ShieldCheck, Sparkles, ArrowRight, Feather } from 'lucide-react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        
        <Navbar/>

        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
            
            {/* Minimalist Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8 border border-stone-100 transition-transform hover:scale-105 cursor-default">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase">AI-Powered Mental Wellness</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-stone-800 leading-[1.1]">
                Find clarity in <br />
                <span className="text-emerald-600">every reflection.</span>
            </h1>
            
            <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Journaly isn't just a place to write. It's an intelligent companion that listens, understands, and offers gentle encouragement when you need it most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group px-8 py-3.5 rounded-full bg-emerald-600 text-white text-lg font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-3.5 rounded-full bg-white text-stone-600 text-lg font-medium border border-stone-200 hover:bg-stone-100 hover:text-stone-900 transition-all shadow-sm hover:-translate-y-0.5">
                View Demo
                </button>
            </div>
            </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">

                {/* Feature Card 1 */}
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors duration-300">
                    <BookHeart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800">Empathetic AI</h3>
                <p className="text-stone-500 leading-relaxed font-light">
                    Our AI doesn't just store text; it analyzes your sentiment to provide personalized words of affirmation and perspective.
                </p>
                </div>

                {/* Feature Card 2 */}
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors duration-300">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800">Private & Secure</h3>
                <p className="text-stone-500 leading-relaxed font-light">
                    Your thoughts are sacred. We use end-to-end encryption to ensure your journal remains for your eyes only.
                </p>
                </div>

                {/* Feature Card 3 */}
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors duration-300">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-stone-800">Growth Tracking</h3>
                <p className="text-stone-500 leading-relaxed font-light">
                    Visualize your mood trends over time and receive gentle nudges to maintain a healthy journaling habit.
                </p>
                </div>
            </div>
            </div>
        </section>

        {/* Quote / Break Section */}
        {/* Shifted to a deep stone color to ground the page without being overly bright or distracting */}
        <section className="py-32 bg-stone-900 text-stone-50 text-center px-4 rounded-t-[3rem] mt-12">
            <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-5xl font-serif italic leading-snug mb-8 text-stone-100">
                "Journaling is like whispering to one’s self and listening at the same time."
            </h2>
            <p className="text-stone-400 text-lg tracking-wide uppercase font-medium">— Mina Murray</p>
            </div>
        </section>

        {/* <Footer /> */}
		<Footer />
        </div>
    );
};

export default LandingPage;