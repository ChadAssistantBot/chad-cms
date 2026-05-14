import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Loader2, Plus, Download } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { getCurrentUser, canCreate, USER_ROLES } from '../lib/rbac'

export default function Finances({}) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const currentUser = getCurrentUser()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

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
      toast.error('Failed to load transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const netProfit = totalIncome - totalExpenses

  return (
    <div className="min-h-screen">
<div className="min-h-screen p-8 lg:p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">Finances</h1>
            <p className="text-muted">Track revenue, expenses, and venture P&L</p>
          </div>
          <div className="flex gap-3">
            <Button className="flex items-center gap-2 border border-line hover:bg-line/20 transition">
              <Download className="w-4 h-4" /> Export
            </Button>
            {canCreate(currentUser.role) && (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gold text-bg font-bold hover:opacity-90 transition"
              >
                <Plus className="w-4 h-4" /> Add Transaction
              </Button>
            )}
          </div>
        </header>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Add New Transaction"
        >
          <form onSubmit={handleSubmit(async (data) => {
            try {
              const { error } = await supabase.from('transactions').insert([{
                ...data,
                amount: parseFloat(data.amount),
                date: new Date().toISOString()
              }])
              if (error) throw error
              toast.success('Transaction added!')
              setIsModalOpen(false)
              reset()
              fetchTransactions()
            } catch (error) {
              toast.error('Failed to add transaction')
            }
          })} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input 
                {...register('description', { required: 'Description is required' })} 
                placeholder="e.g. AWS Credits"
              />
              {errors.description && <p className="text-red text-xs mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (€)</label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...register('amount', { required: 'Amount is required', min: 0.01 })} 
                />
                {errors.amount && <p className="text-red text-xs mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select 
                  {...register('type')}
                  className="w-full bg-bg border border-line rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input {...register('category', { required: 'Category is required' })} placeholder="e.g. Infrastructure" />
            </div>
            <Button type="submit" className="w-full bg-gold text-bg font-bold">Save Transaction</Button>
          </form>
        </Modal>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <Card className="bg-panel border border-line">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowUpCircle className="w-8 h-8 text-green" />
                  <div className="text-sm text-muted">Total Revenue</div>
                </div>
                <div className="text-3xl font-bold text-green">€{totalIncome.toFixed(2)}</div>
              </Card>

              <Card className="bg-panel border border-line">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowDownCircle className="w-8 h-8 text-red" />
                  <div className="text-sm text-muted">Total Expenses</div>
                </div>
                <div className="text-3xl font-bold text-red">€{totalExpenses.toFixed(2)}</div>
              </Card>

              <Card className="bg-panel border border-line">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-gold" />
                  <div className="text-sm text-muted">Net Profit</div>
                </div>
                <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-gold' : 'text-red'}`}>
                  €{netProfit.toFixed(2)}
                </div>
              </Card>
            </div>

            {transactions.length === 0 ? (
              <Card className="bg-panel border border-line">
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
              </Card>
            ) : (
              <Card className="bg-panel border border-line">
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
              </Card>
            )}
          </>
        )}
</div>
    </div>
  )
}
