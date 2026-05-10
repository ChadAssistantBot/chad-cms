import { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'boss' && password === 'PCz8l17qmKUKP8fy') {
      onLogin()
    } else {
      setError('Invalid credentials')
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-panel-strong border border-line rounded-lg px-4 py-3 focus:outline-none focus:border-gold"
              placeholder="boss"
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
