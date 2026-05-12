import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Loader2 } from 'lucide-react'

export default function Finances({ onLogout }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
      
      if (error) throw error
      setTransactions(data || [])

      // Calculate totals
      const income = data?.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
      const expenses = data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
      setTotalIncome(income)
      setTotalExpenses(expenses)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const netProfit = totalIncome - totalExpenses

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-56 bg-bg/80 backdrop-blur-xl border-r border-line p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-3xl">💵</div>
          <div>
            <div className="font-bold">Chad OS</div>
            <div className="text-xs text-muted">Management System</div>
          </div>
        </div>

        <nav className="space-y-1">
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">📋 Dashboard</Link>
          <Link to="/finances" className="block px-4 py-2 rounded-lg bg-gold/10 text-white font-medium">💰 Finances</Link>
          <Link to="/ventures" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🚀 Ventures</Link>
          <Link to="/agents" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">🤖 Agents</Link>
          <Link to="/kanban" className="block px-4 py-2 rounded-lg hover:bg-gold/10 transition">✅ Kanban</Link>
        </nav>

        <button onClick={onLogout} className="absolute bottom-4 left-4 right-4 px-4 py-2 border border-line rounded-lg hover:bg-line/20 transition text-sm">Log Out</button>
      </aside>

      <main className="ml-56 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Finances</h1>
          <p className="text-muted">Track revenue, expenses, and venture P&L</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-panel border border-line rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowUpCircle className="w-8 h-8 text-green" />
                  <div className="text-sm text-muted">Total Revenue</div>
                </div>
                <div className="text-3xl font-bold text-green">€{totalIncome.toFixed(2)}</div>
              </div>

              <div className="bg-panel border border-line rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowDownCircle className="w-8 h-8 text-red" />
                  <div className="text-sm text-muted">Total Expenses</div>
                </div>
                <div className="text-3xl font-bold text-red">€{totalExpenses.toFixed(2)}</div>
              </div>

              <div className="bg-panel border border-line rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-gold" />
                  <div className="text-sm text-muted">Net Profit</div>
                </div>
                <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-gold' : 'text-red'}`}>
                  €{netProfit.toFixed(2)}
                </div>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-panel border border-line rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">No Transactions Yet</h2>
                <p className="text-muted mb-4">
                  Start tracking your finances by adding transactions. This will sync with your venture data automatically.
                </p>
                <div className="p-4 bg-panel-strong rounded-xl border border-line">
                  <code className="text-sm text-gold">
                    1. Add income transactions when revenue is generated<br/>
                    2. Log expenses as they occur<br/>
                    3. View real-time P&L analysis
                  </code>
                </div>
              </div>
            ) : (
              <div className="bg-panel border border-line rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-panel-strong rounded-xl border border-line">
                      <div>
                        <div className="font-semibold">{transaction.description || 'No description'}</div>
                        <div className="text-sm text-muted">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</div>
                      </div>
                      <div className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green' : 'text-red'}`}>
                        {transaction.type === 'income' ? '+' : '-'}€{parseFloat(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
