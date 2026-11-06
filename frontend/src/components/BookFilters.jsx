import { useState } from 'react'

function BookFilters({ onFilter }) {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')

  const handle = (e) => {
    e.preventDefault()
    onFilter({ search, genre })
  }

  const reset = () => {
    setSearch('')
    setGenre('')
    onFilter({ search: '', genre: '' })
  }

  return (
    <form onSubmit={handle} style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-end',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    }}>
      <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
        <label>Search</label>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
        <label>Genre</label>
        <input
          type="text"
          placeholder="Filter by genre..."
          value={genre}
          onChange={e => setGenre(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginTop: 0 }}>
        Search
      </button>

      <button type="button" className="btn btn-outline" onClick={reset}>
        Reset
      </button>
    </form>
  )
}

export default BookFilters
