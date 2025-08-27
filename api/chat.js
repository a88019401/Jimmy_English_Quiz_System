// api/chat.js
// Vercel Serverless Function: POST /api/chat
// Set FREE_API_KEY & BASE_URL in Vercel → Project Settings → Environment Variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const BASE_URL = process.env.BASE_URL || 'https://free.v36.cm/v1';
    const API_KEY  = process.env.FREE_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'Missing FREE_API_KEY env' });

    const body = req.body || {};
    const { model = 'gpt-3.5-turbo', messages = [], temperature = 0.4, stream = false } = body;

    const resp = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages, temperature, stream })
    });

    const data = await resp.json();
    return res.status(resp.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
