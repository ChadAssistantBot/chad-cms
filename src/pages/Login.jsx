import { useState } from 'react'
import { supabase} from '../lib/supabase' // Assuming you have a supabase client configured

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
    } else {
      onLogin() // This would be replaced with actual routing in a full app
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-panel border border-line rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💵</div>
          <h1 className="text-3xl font-bold mb-2">Chad OS</h1>
          <p className="text-muted">Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-panel-strong border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-panel-strong border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gold to-yellow-300 text-bg font-bold py-3 rounded-lg hover:opacity-90 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
