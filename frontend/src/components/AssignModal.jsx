import { useState } from 'react'
import * as api from '../services/api'

function AssignModal({ book, onClose, onAssigned }) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const results = await api.searchUsers(search)
      setUsers(results)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleAssign = async (userId) => {
    setAssigning(true); setError('')
    try {
      const updated = await api.assignBook(book.id, userId)
      onAssigned(updated)
    } catch (err) { setError(err.message) }
    finally { setAssigning(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ marginBottom: 0 }}>Assign Book</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Assigning: <strong>{book.title}</strong>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search users by name or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginTop: 0 }} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {users.length === 0 && (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
              Search for a user to assign this book
            </p>
          )}
          {users.map(user => (
            <div key={user.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '0.5rem',
              background: '#f8fafc'
            }}>
              <div>
                <strong>{user.first_name} {user.last_name}</strong>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>@{user.username}</p>
              </div>
              <button
                className="btn btn-sm btn-edit"
                onClick={() => handleAssign(user.id)}
                disabled={assigning}
              >
                Assign
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default AssignModal
