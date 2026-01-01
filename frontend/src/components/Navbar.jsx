import { useState } from "react";
import {Leaf, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
	<>
		<nav className="sticky top-0 z-50 bg-[#F3F0E7]/90 backdrop-blur-sm border-b border-[#2C4C3B]/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="flex justify-between items-center h-20">
				{/* Logo */}
				<div className="flex items-center gap-2">
				<div className="bg-[#228B22] p-2 rounded-lg">
					<Leaf className="h-6 w-6 text-[#F3F0E7]" />
				</div>
				<span className="text-2xl font-bold tracking-tight text-[#06402B]">Journaly</span>
				</div>

				{/* Desktop Menu */}
				<div className="hidden md:flex items-center gap-8">
				<a href="#features" className="text-[#2C4C3B]/80 hover:text-[#4F772D] transition-colors font-medium">Features</a>
				<a href="#how-it-works" className="text-[#2C4C3B]/80 hover:text-[#4F772D] transition-colors font-medium">How it Works</a>
				<a href="#about" className="text-[#2C4C3B]/80 hover:text-[#4F772D] transition-colors font-medium">Our Mission</a>
				<Link to={"/login"}>
					<button className="px-5 py-2 rounded-full border-2 border-[#2C4C3B] text-[#2C4C3B] font-semibold hover:bg-[#06402B] hover:text-[#F3F0E7] transition-all duration-300 hover:cursor-pointer">
						Log In
					</button>
				</Link>
				<Link to={"/signup"}>
					<button className="px-5 py-2.5 rounded-full bg-[#06402B] text-[#F3F0E7] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:cursor-pointer">
						Sign Up
					</button>
				</Link>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
				<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-[#2C4C3B]">
					{isMenuOpen ? <X /> : <Menu />}
				</button>
				</div>
			</div>
			</div>

			{/* Mobile Menu Dropdown */}
			{isMenuOpen && (
			<div className="md:hidden bg-[#F3F0E7] border-t border-[#2C4C3B]/10 p-4">
				<div className="flex flex-col gap-4">
				<a href="#features" className="text-lg font-medium">Features</a>
				<a href="#how-it-works" className="text-lg font-medium">How it Works</a>
				<a href="#about" className="text-lg font-medium">Our Mission</a>
				<button className="w-full py-3 rounded-xl border-2 border-[#2C4C3B] font-semibold">Log In</button>
				<button className="w-full py-3 rounded-xl bg-[#4F772D] text-[#F3F0E7] font-semibold">Get Started</button>
				</div>
			</div>
			)}
		</nav>
	</>
  )
}

export default Navbar