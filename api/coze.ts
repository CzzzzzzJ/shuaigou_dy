import type { VercelApiHandler } from '@vercel/node';

export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Proxy received request:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    const response = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      console.error('Coze API error:', {
        status: response.status,
        statusText: response.statusText
      });
      return res.status(response.status).json({
        error: 'Coze API error',
        status: response.status,
        message: response.statusText
      });
    }

    const data = await response.text();
    console.log('Proxy response success');
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 