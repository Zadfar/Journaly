import { useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

const SignupPage = () => {
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const { signUpNewUser, signInUserGoogle } = UserAuth();
	
	const navigate = useNavigate();
	
	
	const handleSignUp = async (e) => {
		e.preventDefault();

		const avatar = createAvatar(initials, {
			seed: fullName,
			radius: 50,
			size: 48,
			fontFamily: ["Garamond", "Georgia"]
		});

		const avatarUrl = avatar.toDataUri();

		setLoading(true);
		try {
			const result = await signUpNewUser(email, password, fullName, avatarUrl);

			if (result.success) {
				navigate("/home")
			}
		} catch (error) {
			setError("sign-up error", error);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async (e) => {
		e.preventDefault();
		await signInUserGoogle();
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-[#2C4C3B]">
		
		<div className="w-full max-w-md space-y-8">

			<div className="text-center flex flex-col items-center">
			<Link to={"/"}>
				<div className="flex items-center gap-2">
					<div className="bg-[#228B22] p-2 rounded-lg">
					<Leaf className="h-8 w-8 text-white" />
					</div>
					<span className="text-3xl font-bold tracking-tight text-[#228B22]">Journaly</span>
				</div>
			</Link>
			
			<h2 className="text-3xl font-bold tracking-tight mt-6">Begin your journey</h2>
			<p className="mt-2 text-[#2C4C3B]/60">
				Create an account to start reflecting and growing.
			</p>
			</div>

			{error && <p className='text-red-600 text-center pt-4'>{error}</p>}

			<button
			type="button"
			onClick={handleGoogleLogin}
			className="w-full flex items-center justify-center gap-3 bg-white border border-[#2C4C3B]/20 text-[#2C4C3B] font-semibold mb-3
			 py-3.5 px-4 rounded-xl hover:bg-[#F3F0E7]/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2C4C3B]/20 transition-all duration-200 shadow-sm"
			>
			{/* Official Google "G" Logo SVG */}
			<svg className="h-5 w-5" viewBox="0 0 24 24">
				<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
				/>
				<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
				/>
				<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
				/>
				<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
				/>
			</svg>
			Continue with Google
			</button>

			<div className='text-center my-0'>or</div>

			<form onSubmit={handleSignUp} className="space-y-6 mt-3">

			<div className="space-y-2">
				<label htmlFor="fullname" className="text-sm font-semibold ml-1">
				Full Name
				</label>
				<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Mail className="h-5 w-5 text-[#2C4C3B]/40" />
				</div>
				<input
					id="fullname"
					name="fullname"
					type="text"
					required
					placeholder="Your Full Name"
					className="block w-full pl-10 pr-3 py-3 border border-[#2C4C3B]/20 rounded-xl text-[#2C4C3B] placeholder-[#2C4C3B]/30
					 focus:outline-none focus:ring-2 focus:ring-[#228B22]/50 focus:border-[#228B22] transition-all bg-[#F3F0E7]/30"
					onChange={(e) => setFullName(e.target.value)}
				/>
				</div>
			</div>

			<div className="space-y-2">
				<label htmlFor="email" className="text-sm font-semibold ml-1">
				Email Address
				</label>
				<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Mail className="h-5 w-5 text-[#2C4C3B]/40" />
				</div>
				<input
					id="email"
					name="email"
					type="email"
					required
					placeholder="you@example.com"
					className="block w-full pl-10 pr-3 py-3 border border-[#2C4C3B]/20 rounded-xl text-[#2C4C3B] placeholder-[#2C4C3B]/30
					 focus:outline-none focus:ring-2 focus:ring-[#228B22]/50 focus:border-[#228B22] transition-all bg-[#F3F0E7]/30"
					onChange={(e) => setEmail(e.target.value)}
				/>
				</div>
			</div>

			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-semibold ml-1">
				Password
				</label>
				<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Lock className="h-5 w-5 text-[#2C4C3B]/40" />
				</div>
				<input
					id="password"
					name="password"
					type={showPassword ? "text" : "password"}
					required
					placeholder="••••••••"
					className="block w-full pl-10 pr-10 py-3 border border-[#2C4C3B]/20 rounded-xl text-[#2C4C3B] placeholder-[#2C4C3B]/30
					 focus:outline-none focus:ring-2 focus:ring-[#228B22]/50 focus:border-[#228B22] transition-all bg-[#F3F0E7]/30"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type="button"
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#2C4C3B]/40 hover:text-[#2C4C3B] transition-colors"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
				</button>
				</div>
			</div>

			<button
				type="submit"
				className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white bg-[#228B22] hover:bg-[#008000]
				focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F772D] font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
				disabled={loading}
			>
				Create Account
				<ArrowRight className="ml-2 mt-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
			</button>

			<div className="text-center text-sm">
				<span className="text-[#2C4C3B]/60">Already have an account? </span>
				<Link to={"/login"}>
					<span className="font-semibold text-[#228B22] hover:text-[#008000] hover:underline">
					Log in here
					</span>
				</Link>
			</div>
			</form>
		</div>
		</div>
	);
};

export default SignupPage;