function BookTable({ books, onEdit, onDelete, onAssign }) {
  if (books.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
        No books found
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Published</th>
            <th>Assigned To</th>
            <th>Actions</th>
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
              <td>
                {book.assigned_user
                  ? <span style={{ color: '#4f46e5', fontWeight: 600 }}>
                      {book.assigned_user.first_name} {book.assigned_user.last_name}
                    </span>
                  : <span style={{ color: '#94a3b8' }}>Unassigned</span>}
              </td>
              <td>
                <div className="actions">
                  <button className="btn btn-sm btn-edit" onClick={() => onAssign(book)}>Assign</button>
                  <button className="btn btn-sm btn-edit" onClick={() => onEdit(book)}>Edit</button>
                  <button className="btn btn-sm btn-delete" onClick={() => onDelete(book.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookTable
