export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      });
    }

    const eventId = url.searchParams.get('event');
    if (!eventId) return new Response('Missing ?event=', { status: 400 });

    const prefix = `gallery/${eventId}/`;
    const listed = await env.BUCKET.list({ prefix });

    const BASE = 'https://pub-46fa3f6d65804c9ea240d7ff9b16d7bc.r2.dev';
    const urls = listed.objects
      .filter(o => !o.key.endsWith('.keep') && !o.key.endsWith('/'))
      .map(o => `${BASE}/${o.key}`);

    return Response.json(urls, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  },
};
