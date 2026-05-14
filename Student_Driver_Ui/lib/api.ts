const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string, role: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
    register: (name: string, email: string, password: string, role: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
  },
  buses: {
    getAll: () => request('/buses'),
    getById: (id: string) => request(`/buses/${id}`),
    setTrip: (id: string, tripStarted: boolean) =>
      request(`/buses/${id}/trip`, { method: 'PATCH', body: JSON.stringify({ tripStarted }) }),
    setStatus: (id: string, status: string, delayReason?: string) =>
      request(`/buses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, delayReason }) }),
    sendAlert: (id: string, reason?: string) =>
      request(`/buses/${id}/alert`, { method: 'POST', body: JSON.stringify({ reason }) }),
  },
  complaints: {
    submit: (data: { type: string; description: string; busNumber?: string; driverName?: string }) =>
      request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  },
  gps: {
    updateLocation: (busId: string, latitude: number, longitude: number, speed?: number, heading?: number) =>
      request('/gps/update-location', { method: 'POST', body: JSON.stringify({ busId, latitude, longitude, speed, heading }) }),
    getBusLocation: (busId: string) => request(`/gps/bus/${busId}`),
    getAllBuses: () => request('/gps/all-buses'),
  },
};
