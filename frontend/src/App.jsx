import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import NewBook from './pages/NewBook'
import ListBooks from './pages/ListBooks'
import MyBooks from './pages/MyBooks'
import * as api from './services/api'

function Alert({ msg, type = 'error' }) {
  if (!msg) return null
  return <div className={`alert alert-${type}`}>{msg}</div>
}

function Input({ label, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {props.type === 'select'
        ? <select {...props}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        : <input {...props} />}
    </div>
  )
}

function LoginPage({ onLogin, goRegister }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await api.login(form.username, form.password)
      localStorage.setItem('token', data.access_token)
      onLogin()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h1>Welcome back 👋</h1>
        <p className="subtitle">Sign in to your account</p>
        <Alert msg={error} />
        <form onSubmit={handle}>
          <Input label="Username" type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'1.25rem', color:'#666', fontSize:'0.9rem'}}>
          Don't have an account? <button className="link-btn" onClick={goRegister}>Register</button>
        </p>
      </div>
    </div>
  )
}

function RegisterPage({ goLogin }) {
  const [form, setForm] = useState({ username:'', password:'', first_name:'', last_name:'', age:'', gender:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      await api.register({...form, age: parseInt(form.age)})
      setSuccess('Account created! You can now log in.')
      setTimeout(goLogin, 1500)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-center">
      <div className="card auth-card" style={{maxWidth:500}}>
        <h1>Create Account ✨</h1>
        <p className="subtitle">Join the platform today</p>
        <Alert msg={error} />
        <Alert msg={success} type="success" />
        <form onSubmit={handle}>
          <Input label="Username" type="text" value={form.username} onChange={e => set('username', e.target.value)} required />
          <Input label="Password" type="password" value={form.password} onChange={e => set('password', e.target.value)} required />
          <div className="form-row">
            <Input label="First Name" type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)} required />
            <Input label="Last Name" type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)} required />
          </div>
          <div className="form-row">
            <Input label="Age" type="number" min="1" max="120" value={form.age} onChange={e => set('age', e.target.value)} required />
            <Input label="Gender" type="select" value={form.gender} onChange={e => set('gender', e.target.value)} required />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'1.25rem', color:'#666', fontSize:'0.9rem'}}>
          Already have an account? <button className="link-btn" onClick={goLogin}>Sign in</button>
        </p>
      </div>
    </div>
  )
}

function EditUserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ first_name: user.first_name, last_name: user.last_name, age: user.age, gender: user.gender })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const updated = await api.updateUser(user.id, {...form, age: parseInt(form.age)})
      onSaved(updated)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{marginBottom:0}}>Edit User</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <Alert msg={error} />
        <form onSubmit={handle}>
          <div className="form-row">
            <Input label="First Name" type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)} required />
            <Input label="Last Name" type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)} required />
          </div>
          <div className="form-row">
            <Input label="Age" type="number" min="1" max="120" value={form.age} onChange={e => set('age', e.target.value)} required />
            <Input label="Gender" type="select" value={form.gender} onChange={e => set('gender', e.target.value)} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{width:'auto'}} disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ onLogout, onNavigate }) {
  const [me, setMe] = useState(null)
  const [users, setUsers] = useState([])
  const [editUser, setEditUser] = useState(null)
  const [error, setError] = useState('')

  const fetchMe = useCallback(async () => {
    const data = await api.getMe()
    setMe(data)
  }, [])

  const fetchUsers = useCallback(async () => {
    const data = await api.getUsers()
    setUsers(data)
  }, [])

  useEffect(() => {
    fetchMe().catch(() => onLogout())
    fetchUsers().catch(err => setError(err.message))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.deleteUser(id)
      setUsers(u => u.filter(x => x.id !== id))
      if (me?.id === id) onLogout()
    } catch (err) { setError(err.message) }
  }

  const handleLogout = async () => {
    try { await api.logout() } catch {}
    localStorage.removeItem('token')
    onLogout()
  }

  const handleSaved = (updated) => {
    setUsers(u => u.map(x => x.id === updated.id ? updated : x))
    if (me?.id === updated.id) setMe(updated)
    setEditUser(null)
  }

  const initials = (u) => `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()

  return (
    <div>
      <nav className="navbar">
        <span className="nav-brand">👥 UserHub</span>
        <div className="nav-user">
          {me && <><div className="avatar">{initials(me)}</div><span style={{color:'#334155', fontWeight:600}}>{me.first_name}</span></>}
          <button className="btn btn-sm btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div style={{ display: 'flex' }}>
        <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
        <div style={{ flex: 1 }}>
          <div className="container">
            <Alert msg={error} />
            {me && (
              <div className="user-info-card">
                <div className="big-avatar">{initials(me)}</div>
                <div className="info">
                  <h3>{me.first_name} {me.last_name}</h3>
                  <p>@{me.username} · Age {me.age} · {me.gender.charAt(0).toUpperCase()+me.gender.slice(1)}</p>
                </div>
              </div>
            )}
            <div className="card">
              <div className="section-header">
                <h2 style={{marginBottom:0}}>All Users <span style={{color:'#94a3b8', fontWeight:400, fontSize:'1rem'}}>({users.length})</span></h2>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{color:'#94a3b8'}}>{u.id}</td>
                        <td><strong>{u.first_name} {u.last_name}</strong></td>
                        <td style={{color:'#6366f1'}}>@{u.username}</td>
                        <td>{u.age}</td>
                        <td><span className={`badge badge-${u.gender}`}>{u.gender}</span></td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-sm btn-edit" onClick={() => setEditUser(u)}>Edit</button>
                            <button className="btn btn-sm btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={6} style={{textAlign:'center', color:'#94a3b8', padding:'2rem'}}>No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleSaved} />}
    </div>
  )
}

function BookLayout({ page, onLogout, onNavigate }) {
  const [me, setMe] = useState(null)

  useEffect(() => {
    api.getMe().then(setMe).catch(() => onLogout())
  }, [])

  const handleLogout = async () => {
    try { await api.logout() } catch {}
    localStorage.removeItem('token')
    onLogout()
  }

  const initials = (u) => `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()

  return (
    <div>
      <nav className="navbar">
        <span className="nav-brand">📚 BookHub</span>
        <div className="nav-user">
          {me && <><div className="avatar">{initials(me)}</div><span style={{color:'#334155', fontWeight:600}}>{me.first_name}</span></>}
          <button className="btn btn-sm btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div style={{ display: 'flex' }}>
        <Sidebar currentPage={page} onNavigate={onNavigate} />
        <div style={{ flex: 1 }}>
          {page === 'new-book' && <NewBook />}
          {page === 'list-books' && <ListBooks />}
          {page === 'my-books' && <MyBooks />}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState(localStorage.getItem('token') ? 'dashboard' : 'login')

  const onLogin = () => setPage('dashboard')
  const onLogout = () => { localStorage.removeItem('token'); setPage('login') }
  const onNavigate = (p) => setPage(p)

  if (page === 'login') return <LoginPage onLogin={onLogin} goRegister={() => setPage('register')} />
  if (page === 'register') return <RegisterPage goLogin={() => setPage('login')} />
  if (page === 'dashboard') return <Dashboard onLogout={onLogout} onNavigate={onNavigate} />
  return <BookLayout page={page} onLogout={onLogout} onNavigate={onNavigate} />
}