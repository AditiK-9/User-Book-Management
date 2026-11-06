import { useState } from 'react'
import BookForm from '../components/BookForm'
import * as api from '../services/api'

function NewBook() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (formData) => {
    setLoading(true); setError(''); setSuccess('')
    try {
      await api.createBook(formData)
      setSuccess('Book created successfully!')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.25rem' }}>📖 New Book</h1>
      <p className="subtitle">Add a new book to the library</p>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <BookForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewBook
