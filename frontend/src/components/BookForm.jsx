import { useState } from 'react'

function BookForm({ initialData = {}, onSubmit, onCancel, loading, error }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    published_date: initialData.published_date || '',
    isbn: initialData.isbn || '',
    genre: initialData.genre || '',
    description: initialData.description || '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handle = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handle}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>Title *</label>
        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Author *</label>
        <input type="text" value={form.author} onChange={e => set('author', e.target.value)} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Published Date</label>
          <input type="text" placeholder="e.g. 2021" value={form.published_date} onChange={e => set('published_date', e.target.value)} />
        </div>
        <div className="form-group">
          <label>ISBN</label>
          <input type="text" value={form.isbn} onChange={e => set('isbn', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Genre</label>
        <input type="text" placeholder="e.g. Fiction, Science, History" value={form.genre} onChange={e => set('genre', e.target.value)} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }}
        />
      </div>

      <div className="modal-footer">
        {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
          {loading ? 'Saving…' : 'Save Book'}
        </button>
      </div>
    </form>
  )
}

export default BookForm
