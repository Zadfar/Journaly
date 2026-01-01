import { BookHeart, ShieldCheck, Sparkles, ArrowRight} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-white text-[#2C4C3B]">
		<Navbar />
		{/* Hero Section */}
		<section className="relative pt-20 pb-32 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
			<div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-8 border border-[#2C4C3B]/10">
				<Sparkles className="w-4 h-4 text-[#8C6A5D]" />
				<span className="text-sm font-medium text-[#8C6A5D] tracking-wide uppercase">AI-Powered Mental Wellness</span>
			</div>
			
			<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
				Find clarity in <br />
				<span className="text-[#4F772D]">every reflection.</span>
			</h1>
			
			<p className="text-xl text-[#2C4C3B]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
				Journaly isn't just a place to write. It's an intelligent companion that listens, understands, and offers gentle encouragement when you need it most.
			</p>
			
			<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<button className="group px-8 py-4 rounded-full bg-[#228B22] text-[#F3F0E7] text-lg font-semibold hover:bg-[#008000] transition-all shadow-xl hover:shadow-2xl flex items-center gap-2">
				Start Your Journey
				<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
				</button>
				<button className="px-8 py-4 rounded-full bg-white text-[#2C4C3B] text-lg font-semibold border border-[#2C4C3B]/10 hover:bg-[#F9F9F9] transition-all shadow-sm">
				View Demo
				</button>
			</div>
			</div>
		</section>

		{/* Features Grid */}
		<section id="features" className="py-24 bg-white/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="grid md:grid-cols-3 gap-12">

				<div className="bg-[#F3F0E7] p-8 rounded-3xl border border-[#2C4C3B]/5 hover:border-[#4F772D]/30 transition-colors">
				<div className="w-14 h-14 bg-[#4F772D]/10 rounded-2xl flex items-center justify-center mb-6">
					<BookHeart className="w-7 h-7 text-[#4F772D]" />
				</div>
				<h3 className="text-2xl font-bold mb-4">Empathetic AI</h3>
				<p className="text-[#2C4C3B]/70 leading-relaxed">
					Our LLM doesn't just store text; it analyzes your sentiment to provide personalized words of affirmation and perspective.
				</p>
				</div>

				<div className="bg-[#F3F0E7] p-8 rounded-3xl border border-[#2C4C3B]/5 hover:border-[#4F772D]/30 transition-colors">
				<div className="w-14 h-14 bg-[#8C6A5D]/10 rounded-2xl flex items-center justify-center mb-6">
					<ShieldCheck className="w-7 h-7 text-[#8C6A5D]" />
				</div>
				<h3 className="text-2xl font-bold mb-4">Private & Secure</h3>
				<p className="text-[#2C4C3B]/70 leading-relaxed">
					Your thoughts are sacred. We use end-to-end encryption to ensure your journal remains for your eyes only.
				</p>
				</div>

				<div className="bg-[#F3F0E7] p-8 rounded-3xl border border-[#2C4C3B]/5 hover:border-[#4F772D]/30 transition-colors">
				<div className="w-14 h-14 bg-[#2C4C3B]/10 rounded-2xl flex items-center justify-center mb-6">
					<Sparkles className="w-7 h-7 text-[#2C4C3B]" />
				</div>
				<h3 className="text-2xl font-bold mb-4">Growth Tracking</h3>
				<p className="text-[#2C4C3B]/70 leading-relaxed">
					Visualize your mood trends over time and receive gentle nudges to maintain a healthy journaling habit.
				</p>
				</div>
			</div>
			</div>
		</section>

		{/* Quote / Break Section */}
		<section className="py-32 bg-[#2C4C3B] text-[#F3F0E7] text-center px-4">
			<div className="max-w-4xl mx-auto">
			<h2 className="text-3xl md:text-5xl font-serif italic leading-snug mb-8">
				"Journaling is like whispering to one’s self and listening at the same time."
			</h2>
			<p className="text-[#F3F0E7]/60 text-lg">— Mina Murray</p>
			</div>
		</section>

		<Footer />
		</div>
	);
};

export default LandingPage;