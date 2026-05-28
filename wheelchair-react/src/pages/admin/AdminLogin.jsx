import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../hooks/useApi'
import Icon from '../../components/Icon'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || "Email yoki parol noto'g'ri")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #f8f9fb 0%, #e8f0f8 100%)' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-blue-900 font-headline mb-2">wheelchair.uz</h1>
          <p className="text-on-surface-variant font-medium">Admin Panel</p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl ambient-shadow border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email</label>
              <input className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-secondary focus:ring-offset-4 transition-all outline-none"
                placeholder="admin@wheelchair.uz" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Parol</label>
                <button type="button" className="text-[10px] text-primary font-bold hover:underline">UNUTDIM?</button>
              </div>
              <div className="relative">
                <input className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-secondary focus:ring-offset-4 transition-all outline-none pr-12"
                  placeholder="••••••••" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                  <Icon name={showPass ? 'visibility_off' : 'visibility'} size={20} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
                <Icon name="error" size={16} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full signature-gradient text-on-primary font-bold py-4 rounded-xl shadow-lg hover:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Icon name="hourglass_empty" className="animate-spin" /> : <Icon name="login" />}
              Kirish
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/10 text-center">
            <p className="text-xs text-on-surface-variant">Authorized personnel only.</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-1">
            <Icon name="arrow_back" size={16} /> Saytga qaytish
          </a>
        </div>
      </div>
    </div>
  )
}
