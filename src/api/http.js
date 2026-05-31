import { API_BASE_URL } from './config';

function getToken() {
  return localStorage.getItem('token');
}

function buildHeaders(body) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const hasJson = contentType.includes('application/json');
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.Message || response.statusText || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(body),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseResponse(response);
}
