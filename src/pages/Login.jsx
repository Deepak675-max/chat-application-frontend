import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import { Lock, Mail, Loader2, AlertCircle, MessageCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { connectSocket } = useSocket();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.error) {
        throw new Error(response.data.error.message || 'Login failed');
      }
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      
      // Connect and register the socket
      const userId = user ? user.userId || user.id : response.data.data.userId;
      connectSocket(userId);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl animate-scale-in">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl mb-3 text-indigo-500">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue talking</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-sm mb-6 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
