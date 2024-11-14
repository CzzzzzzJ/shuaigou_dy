export default async function handler(req, res) {
  // 添加路由日志
  console.log('API Route Hit:', req.url);

  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cozeResponse = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!cozeResponse.ok) {
      return res.status(cozeResponse.status).json({
        error: 'Coze API error',
        status: cozeResponse.status,
        message: cozeResponse.statusText
      });
    }

    const data = await cozeResponse.text();
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error?.message || 'Unknown error'
    });
  }
} 