function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: '👥 Users', },
    { id: 'new-book', label: '📖 New Book' },
    { id: 'list-books', label: '�� List Books' },
    { id: 'my-books', label: '👤 My Books' },
  ]

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      background: '#1e1b4b',
      padding: '1.5rem 0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>📚 BookHub</h2>
      </div>

      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            background: currentPage === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
            border: 'none',
            color: currentPage === item.id ? 'white' : 'rgba(255,255,255,0.6)',
            padding: '0.85rem 1.5rem',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: currentPage === item.id ? 600 : 400,
            borderLeft: currentPage === item.id ? '3px solid #818cf8' : '3px solid transparent',
            transition: 'all 0.2s',
            width: '100%',
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default Sidebar
