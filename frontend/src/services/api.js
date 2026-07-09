const API_BASE = window.location.origin.includes('localhost') 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'https://your-heroku-app.herokuapp.com/api');

// Helper to make request with authentication headers automatically attached
const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const api = {
  auth: {
    register: (name, email, password, role) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      }),
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request('/auth/me', { method: 'GET' }),
    hasAdmin: () => request('/auth/has-admin', { method: 'GET' }),
    updateProfile: (profileData) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },
  tasks: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const queryString = params.toString() ? `?${params.toString()}` : '';
      return request(`/tasks${queryString}`, { method: 'GET' });
    },
    get: (id) => request(`/tasks/${id}`, { method: 'GET' }),
    create: (taskData) =>
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    update: (id, taskData) =>
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      }),
    delete: (id) =>
      request(`/tasks/${id}`, {
        method: 'DELETE',
      }),
  },
  messages: {
    getHistory: () => request('/messages', { method: 'GET' }),
    getAdminThreads: () => request('/messages/admin/threads', { method: 'GET' }),
    getAdminThreadDetails: (userId) => request(`/messages/admin/thread/${userId}`, { method: 'GET' }),
  },
  campaigns: {
    getAll: () => request('/campaigns', { method: 'GET' }),
    create: (data) => request('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  },
  art: {
    getAll: () => request('/art', { method: 'GET' }),
    create: (data) => request('/art', { method: 'POST', body: JSON.stringify(data) }),
  },
};
