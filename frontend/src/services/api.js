const API = 'http://localhost:8000'

const getToken = () => localStorage.getItem('token')

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
})

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, options)
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data
}

// Auth
export const login = (username, password) =>
  apiFetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })

export const logout = () =>
  apiFetch('/logout', { method: 'POST', headers: authHeaders() })

export const getMe = () =>
  apiFetch('/me', { headers: authHeaders() })

// Users
export const getUsers = () =>
  apiFetch('/users', { headers: authHeaders() })

export const searchUsers = (q) =>
  apiFetch(`/users/search?q=${q}`, { headers: authHeaders() })

export const register = (data) =>
  apiFetch('/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })

export const updateUser = (id, data) =>
  apiFetch(`/users/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })

export const deleteUser = (id) =>
  apiFetch(`/users/${id}`, { method: 'DELETE', headers: authHeaders() })

// Books
export const getBooks = (search, genre) => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (genre) params.append('genre', genre)
  return apiFetch(`/books?${params}`, { headers: authHeaders() })
}

export const getMyBooks = () =>
  apiFetch('/books/my-books', { headers: authHeaders() })

export const createBook = (data) =>
  apiFetch('/books', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })

export const updateBook = (id, data) =>
  apiFetch(`/books/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })

export const deleteBook = (id) =>
  apiFetch(`/books/${id}`, { method: 'DELETE', headers: authHeaders() })

export const assignBook = (bookId, userId) =>
  apiFetch(`/books/${bookId}/assign?user_id=${userId}`, { method: 'PUT', headers: authHeaders() })
