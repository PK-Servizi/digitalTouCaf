import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckSquare, Square, LogIn, Mail } from 'lucide-react';
import logo from '../logo/logo-tuocaf.png';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    onLogin(email.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1E3A5F] to-[#2A5580] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 md:p-10 border border-white/20">
        {/* Brand */}
        <div className="text-center mb-8">
          <img src={logo} alt="tuoCAF" className="h-16 sm:h-20 mx-auto mb-4" />
          <p className="text-gray-400 mt-2 text-sm sm:text-base tracking-wide">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 pr-12 bg-gray-50/50 text-sm sm:text-base"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRemember(!remember)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {remember ? (
                <CheckSquare size={18} className="text-[#E87425]" />
              ) : (
                <Square size={18} className="text-gray-300" />
              )}
              Remember me
            </button>
            <Link to="/forgot-password" className="text-sm text-[#E87425] hover:text-[#D0621F] font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#E87425] to-[#F2943D] hover:from-[#D0621F] hover:to-[#E87425] text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Log In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#E87425] hover:text-[#D0621F] font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          TuoCAF &copy; {new Date().getFullYear()} — All rights reserved
        </p>
      </div>
    </div>
  );
}
