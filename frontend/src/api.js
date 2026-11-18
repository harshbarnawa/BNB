const configuredBase = (process.env.REACT_APP_API_BASE_URL || '').trim().replace(/\/+$/, '');
const localBase = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:5000'
  : '';

export const apiBaseUrl = configuredBase || localBase;
export const apiEnabled = Boolean(apiBaseUrl);

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  if (!apiEnabled) {
    throw new Error('Online enquiries are not configured yet.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;

    const response = await fetch(apiBaseUrl + path, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || 'Something went wrong. Please try again.');
    }

    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The server did not respond in time. Please check whether your enquiry was received before trying again.');
    }
    if (error instanceof TypeError) {
      throw new Error('Could not connect to the BNB server. Please try again later.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
