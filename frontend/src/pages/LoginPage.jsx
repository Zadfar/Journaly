import { useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { signInUser, signInUserGoogle } = UserAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true);
        try {
            const result = await signInUser(email, password);
            if (result.success) {
                navigate("/home")
            }
        } catch (error) {
            setError(error.message || "Failed to log in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInUserGoogle();
        } catch (error) {
            setError("Google login failed. Please try again.", error);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* Main Container with smooth fade-in animation */}
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            
            {/* Header section */}
            <div className="text-center flex flex-col items-center">
                <Link to={"/"} className="inline-block transition-transform hover:scale-105">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="bg-emerald-50 p-2.5 rounded-xl flex items-center justify-center">
                            <Leaf className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="text-2xl font-serif font-semibold tracking-tight text-stone-800">Journaly</span>
                    </div>
                </Link>
            
                <h2 className="text-3xl font-bold tracking-tight mt-6 text-stone-800">Welcome back</h2>
                <p className="mt-2 text-stone-500 font-light">
                    Enter your details to access your personal space.
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-white p-8 sm:p-10 rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 text-stone-700 font-medium 
                    py-3.5 px-4 rounded-xl hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500/20 transition-all duration-200 shadow-sm hover:shadow"
                >
                    {/* Official Google "G" Logo SVG */}
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Login with Google
                </button>

                {/* Elegant Divider */}
                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-stone-400 font-light">or log in with email</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-stone-700 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="block w-full pl-11 pr-4 py-3.5 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400
                            focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all bg-stone-50"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-stone-700 ml-1">
                            Password
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="block w-full pl-11 pr-12 py-3.5 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400
                            focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all bg-stone-50"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white bg-emerald-600 hover:bg-emerald-700
                        focus:outline-none focus:ring-4 focus:ring-emerald-500/20 font-medium text-lg shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                        {!loading && <ArrowRight className="ml-2 mt-0.5 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>
            </div>

            <div className="text-center text-sm mt-4">
                <span className="text-stone-500">Don't have an account yet? </span>
                <Link to={"/signup"}>
                    <span className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4 transition-colors">
                        Create an account
                    </span>
                </Link>
            </div>
            
        </div>
        </div>
    );
};

export default LoginPage;