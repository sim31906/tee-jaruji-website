/**
 * tee-gallery Cloudflare Worker
 *
 * Endpoints:
 *   ?event={id}   → lists gallery/{id}/ images  (existing)
 *   ?folder={name} → lists {name}/ any files     (new: use for PR videos with ?folder=pr)
 *
 * R2 binding: BUCKET → tee-collab bucket
 * Deploy: paste this into tee-gallery worker on Cloudflare dashboard
 */

const R2_PUBLIC = 'https://pub-46fa3f6d65804c9ea240d7ff9b16d7bc.r2.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const event  = url.searchParams.get('event');
    const folder = url.searchParams.get('folder');

    let prefix;
    if (folder) {
      prefix = `${folder}/`;
    } else if (event) {
      prefix = `gallery/${event}/`;
    } else {
      return new Response(
        JSON.stringify({ error: 'missing event or folder param' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const listed = await env.BUCKET.list({ prefix });

    const items = listed.objects
      .filter(o => !o.key.endsWith('/') && !o.key.split('/').pop().startsWith('.') && o.size > 0)
      .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))
      .map(o => ({
        key: o.key,
        url: `${R2_PUBLIC}/${o.key.split('/').map(encodeURIComponent).join('/')}`,
        name: o.key.replace(prefix, ''),
      }));

    return new Response(JSON.stringify(items), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  },
};
