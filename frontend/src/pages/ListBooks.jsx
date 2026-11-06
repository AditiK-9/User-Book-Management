import { useState, useEffect } from 'react'
import BookTable from '../components/BookTable'
import BookFilters from '../components/BookFilters'
import BookForm from '../components/BookForm'
import AssignModal from '../components/AssignModal'
import * as api from '../services/api'

function ListBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editBook, setEditBook] = useState(null)
  const [assignBook, setAssignBook] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  const fetchBooks = async (filters = {}) => {
    setLoading(true); setError('')
    try {
      const data = await api.getBooks(filters.search, filters.genre)
      setBooks(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBooks() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return
    try {
      await api.deleteBook(id)
      setBooks(b => b.filter(x => x.id !== id))
    } catch (err) { setError(err.message) }
  }

  const handleEditSubmit = async (formData) => {
    setEditLoading(true); setEditError('')
    try {
      const updated = await api.updateBook(editBook.id, formData)
      setBooks(b => b.map(x => x.id === updated.id ? updated : x))
      setEditBook(null)
    } catch (err) { setEditError(err.message) }
    finally { setEditLoading(false) }
  }

  const handleAssigned = (updated) => {
    setBooks(b => b.map(x => x.id === updated.id ? updated : x))
    setAssignBook(null)
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.25rem' }}>📋 List Books</h1>
      <p className="subtitle">Manage all books in the library</p>

      <div className="card">
        <BookFilters onFilter={fetchBooks} />

        {error && <div className="alert alert-error">{error}</div>}

        {loading
          ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading books...</p>
          : <BookTable
              books={books}
              onEdit={setEditBook}
              onDelete={handleDelete}
              onAssign={setAssignBook}
            />
        }
      </div>

      {editBook && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditBook(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 style={{ marginBottom: 0 }}>Edit Book</h2>
              <button className="modal-close" onClick={() => setEditBook(null)}>×</button>
            </div>
            <BookForm
              initialData={editBook}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditBook(null)}
              loading={editLoading}
              error={editError}
            />
          </div>
        </div>
      )}

      {assignBook && (
        <AssignModal
          book={assignBook}
          onClose={() => setAssignBook(null)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  )
}

export default ListBooks
