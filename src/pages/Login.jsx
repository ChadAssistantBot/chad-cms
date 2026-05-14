import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with Supabase Auth or proper backend auth
    // Production: move credentials to env vars
    setTimeout(() => {
      if (username === 'boss' && password === 'PCz8l17qmKUKP8fy') {
        login({
          id: '1',
          name: 'Chad',
          role: 'admin',
          email: 'chad@iterationstation.com',
        });
        toast.success('Welcome back, Boss!');
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md glass-panel-strong rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Chad CMS</h1>
          <p className="text-muted">Enterprise Management Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-panel-strong border border-line rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-gold transition"
              placeholder="Enter username"
              required
              aria-label="Username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel-strong border border-line rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-gold transition"
              placeholder="Enter password"
              required
              aria-label="Password"
            />
          </div>

          {isLoading ? (
            <button
              type="button"
              className="w-full bg-gold text-bg font-bold py-3 rounded-lg animate-pulse"
            >
              Signing in...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold to-yellow-300 text-bg font-bold py-3 rounded-lg hover:opacity-90 transition transform hover:scale-[1.02]"
            >
              Sign In
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted">
          <p>Chad CMS v2.0 • Enterprise Edition</p>
        </div>
      </div>
    </div>
  );
}
