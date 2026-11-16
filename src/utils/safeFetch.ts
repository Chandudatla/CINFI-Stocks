import { handleStaticApiFallback } from './staticFallback';

export interface FetchJsonError extends Error {
  status?: number;
  payload?: any;
}

const STATIC_FALLBACK_STATUSES = new Set([403, 404, 405, 501, 502, 503, 504]);

export async function fetchJson<T = any>(
  input: string,
  init?: RequestInit & { retries?: number }
): Promise<T> {
  const { retries = 1, ...fetchInit } = init || {};
  const method = (fetchInit.method || 'GET').toUpperCase();
  const maxAttempts = method === 'GET' ? 1 + Math.max(0, retries) : 1;
  const isApiPath = input.startsWith('/api/');

  let lastError: FetchJsonError | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(input, fetchInit);
      const rawText = await res.text();
      let parsed: any = null;
      let isJson = false;

      if (rawText) {
        try {
          parsed = JSON.parse(rawText);
          isJson = true;
        } catch {
          isJson = false;
        }
      }

      if (isApiPath && !isJson && (res.ok || STATIC_FALLBACK_STATUSES.has(res.status))) {
        const fallback = await handleStaticApiFallback(input, fetchInit);
        if (fallback !== null) {
          return fallback as T;
        }
      }

      if (!res.ok) {
        if (
          attempt + 1 < maxAttempts &&
          (res.status >= 502 || (!isJson && res.status === 404))
        ) {
          await new Promise((r) => setTimeout(r, 450));
          continue;
        }
        const msg =
          (isJson && (parsed?.error || parsed?.message)) ||
          `Live service unavailable (HTTP ${res.status}). Please retry in a moment.`;
        const err: FetchJsonError = new Error(msg);
        err.status = res.status;
        if (isJson && parsed) {
          err.payload = parsed;
        }
        throw err;
      }

      if (!isJson) {
        if (attempt + 1 < maxAttempts) {
          await new Promise((r) => setTimeout(r, 450));
          continue;
        }
        throw new Error('Live backend returned an unexpected response. Please retry.');
      }

      return parsed as T;
    } catch (err: any) {
      if (err?.name === 'AbortError' || fetchInit.signal?.aborted) {
        throw err;
      }
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt + 1 < maxAttempts && !err?.status) {
        await new Promise((r) => setTimeout(r, 450));
        continue;
      }
      if (isApiPath && !err?.status) {
        try {
          const fallback = await handleStaticApiFallback(input, fetchInit);
          if (fallback !== null) {
            return fallback as T;
          }
        } catch {
          // Ignore fallback errors and surface original message
        }
      }
      throw lastError;
    }
  }

  throw lastError || new Error('Unable to reach live backend');
}
