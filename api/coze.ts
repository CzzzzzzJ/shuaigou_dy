export default async function handler(req, res) {
  // 添加请求日志
  console.log('API Route Hit:', {
    url: req.url,
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body
  });

  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed',
      receivedMethod: req.method
    });
  }

  try {
    // 验证请求体
    if (!req.body) {
      console.error('Missing request body');
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body is missing'
      });
    }

    console.log('Making request to Coze API with body:', req.body);

    const cozeResponse = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    console.log('Coze API response status:', cozeResponse.status);

    if (!cozeResponse.ok) {
      console.error('Coze API error:', {
        status: cozeResponse.status,
        statusText: cozeResponse.statusText,
        headers: Object.fromEntries(cozeResponse.headers.entries())
      });

      return res.status(cozeResponse.status).json({
        error: 'Coze API error',
        status: cozeResponse.status,
        message: cozeResponse.statusText,
        details: await cozeResponse.text().catch(() => 'No error details available')
      });
    }

    const data = await cozeResponse.text();
    console.log('Coze API response data length:', data.length);
    console.log('Response data preview:', data.substring(0, 200));

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Proxy error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      code: error?.code
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      type: error?.name,
      code: error?.code,
      path: req.url
    });
  }
} 