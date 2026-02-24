export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const merged = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };
  return fetch(url, merged);
}
