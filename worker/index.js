// Cloudflare Worker in front of the static build.
//  • /v1/*  → proxied to the Bimayantra API (API_ORIGIN), so the browser still sees ONE origin:
//             session cookies (HttpOnly, SameSite) keep working without CORS — same as the Vite dev proxy.
//  • anything else → static assets from ./dist (SPA fallback to index.html is handled by [assets]).
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/v1' || url.pathname.startsWith('/v1/')) {
      if (!env.API_ORIGIN) {
        return Response.json(
          { error: { code: 'API_NOT_CONFIGURED', messageId: 'GEN-07', message: 'API_ORIGIN is not set on the Cloudflare Worker.' } },
          { status: 503 },
        )
      }
      const target = new URL(url.pathname + url.search, env.API_ORIGIN)
      const headers = new Headers(request.headers)
      headers.set('X-Forwarded-Host', url.host)
      headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''))
      const ip = request.headers.get('CF-Connecting-IP')
      if (ip) headers.set('X-Forwarded-For', ip)

      return fetch(target, {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'manual',
      })
    }

    return env.ASSETS.fetch(request)
  },
}