const VITE_API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Returns the fully qualified API URL depending on deployment configuration.
 * Locally or when proxied, VITE_API_URL is empty, returning a relative path.
 * When deployed on Vercel, VITE_API_URL points to the Render backend domain.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${VITE_API_URL}${cleanPath}`;
}
