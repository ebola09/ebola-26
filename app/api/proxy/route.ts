const isAllowedProtocol = (url: URL) => url.protocol === 'http:' || url.protocol === 'https:';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');

  if (!target) {
    return new Response('Missing url parameter.', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response('Invalid url parameter.', { status: 400 });
  }

  if (!isAllowedProtocol(parsed)) {
    return new Response('Unsupported protocol.', { status: 400 });
  }

  try {
    const upstream = await fetch(parsed.toString(), { redirect: 'follow' });
    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const cacheControl = upstream.headers.get('cache-control');
    const body = await upstream.arrayBuffer();
    const headers = new Headers({ 'content-type': contentType });
    if (cacheControl) {
      headers.set('cache-control', cacheControl);
    }
    return new Response(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers
    });
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    return new Response('Failed to fetch target.', { status: 502 });
  }
}
