import { useState, useEffect } from 'react'
import * as api from '../services/api'

function MyBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyBooks = async () => {
      setLoading(true); setError('')
      try {
        const data = await api.getMyBooks()
        setBooks(data)
      } catch (err) { setError(err.message) }
      finally { setLoading(false) }
    }
    fetchMyBooks()
  }, [])

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.25rem' }}>👤 My Books</h1>
      <p className="subtitle">Books assigned to you</p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading
        ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading...</p>
        : books.length === 0
          ? <div className="card" style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
              No books assigned to you yet
            </div>
          : <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Genre</th>
                      <th>Published</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td style={{ color: '#94a3b8' }}>{book.id}</td>
                        <td><strong>{book.title}</strong></td>
                        <td>{book.author}</td>
                        <td>
                          {book.genre
                            ? <span className="badge badge-other">{book.genre}</span>
                            : <span style={{ color: '#94a3b8' }}>—</span>}
                        </td>
                        <td>{book.published_date || '—'}</td>
                        <td style={{ color: '#64748b', fontSize: '0.88rem' }}>
                          {book.description || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      }
    </div>
  )
}

export default MyBooks
