export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/extract' && request.method === 'POST') {
      try {
        const body = await request.json();
        const videoUrl = body.url;

        if (!videoUrl) {
          return new Response(JSON.stringify({ error: 'Missing URL' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        // ⚠️ REPLACE THIS URL WITH YOUR ACTUAL RENDER URL ⚠️
        const backendResp = await fetch('https://vidfetch-backend-xxxx.onrender.com/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: videoUrl }),
        });

        const data = await backendResp.json();

        return new Response(JSON.stringify(data), {
          status: backendResp.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Backend error: ' + e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  },
};
