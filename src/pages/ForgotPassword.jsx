import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import logo from '../logo/logo-tuocaf.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1E3A5F] to-[#2A5580] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 md:p-10 border border-white/20">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="tuoCAF" className="h-16 sm:h-20 mx-auto mb-4" />
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Reset your password</p>
        </div>

        {sent ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E87425] to-[#F2943D] text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5 text-center">
              Enter the email associated with your account and we'll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg animate-fade-in">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
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

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E87425] to-[#F2943D] hover:from-[#D0621F] hover:to-[#E87425] text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Reset Link
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#E87425] hover:text-[#D0621F] font-medium transition-colors">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          TuoCAF &copy; {new Date().getFullYear()} — All rights reserved
        </p>
      </div>
    </div>
  );
}
