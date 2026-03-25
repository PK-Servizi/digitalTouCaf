import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Mail, User, Lock } from 'lucide-react';
import logo from '../logo/logo-tuocaf.png';

export default function Signup({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your full name'); return; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError('Please enter a valid email'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setSuccess(true);
    setTimeout(() => onLogin(form.email.trim()), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1E3A5F] to-[#2A5580] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 md:p-10 border border-white/20">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="tuoCAF" className="h-16 sm:h-20 mx-auto mb-4" />
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Create your account</p>
        </div>

        {success ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <UserPlus size={28} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Account Created!</h2>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                  autoComplete="new-password"
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

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E87425]/30 focus:border-[#E87425] transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E87425] to-[#F2943D] hover:from-[#D0621F] hover:to-[#E87425] text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Create Account
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="text-[#E87425] hover:text-[#D0621F] font-semibold transition-colors">
              Sign In
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
