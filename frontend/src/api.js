const LOCAL_API = 'http://localhost:4000';

function inferDefaultApiBaseUrl() {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window === 'undefined') return LOCAL_API;

  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  // In production (deployed), prefer same-origin so cookies/auth work reliably.
  return isLocal ? LOCAL_API : '';
}

export const API_BASE_URL = inferDefaultApiBaseUrl();

let inflightCount = 0;
let slowCount = 0;

function emit(name, detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const merged = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  inflightCount += 1;
  emit('api:inflight', { count: inflightCount });

  let markedSlow = false;
  const slowTimer = setTimeout(() => {
    markedSlow = true;
    slowCount += 1;
    emit('api:slow', { active: true, count: slowCount });
  }, 1200);

  try {
    return await fetch(url, merged);
  } finally {
    clearTimeout(slowTimer);

    inflightCount = Math.max(0, inflightCount - 1);
    emit('api:inflight', { count: inflightCount });

    if (markedSlow) {
      slowCount = Math.max(0, slowCount - 1);
      emit('api:slow', { active: slowCount > 0, count: slowCount });
    }
  }
}
