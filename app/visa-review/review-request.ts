const api = '/api/visa-review';

export async function request<T>(payload?: Record<string, unknown> | FormData): Promise<T> {
  const isMaterials = payload instanceof FormData;
  const response = await fetch(isMaterials ? api + '/materials' : api, {
    cache: 'no-store',
    credentials: 'same-origin',
    ...(payload ? {method: 'POST', body: isMaterials ? payload : JSON.stringify(payload)} : {}),
    ...(payload && !isMaterials ? {headers: {'Content-Type': 'application/json'}} : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : '');
  return data as T;
}
