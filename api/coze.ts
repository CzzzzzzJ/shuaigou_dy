interface RequestBody {
  workflow_id: string;
  parameters: {
    user_id: string;
    text: string;
    user_input: string;
  };
}

interface ResponseError {
  error: string;
  message?: string;
  status?: number;
}

export default async function handler(req: any, res: any) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
    });
  }

  try {
    console.log('Proxy received request:', {
      method: req.method,
      headers: req.headers,
    });

    const body = req.body as RequestBody;
    if (!body?.workflow_id || !body?.parameters) {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Missing required fields'
      });
    }

    const cozeResponse = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!cozeResponse.ok) {
      console.error('Coze API error:', {
        status: cozeResponse.status,
        statusText: cozeResponse.statusText
      });
      return res.status(cozeResponse.status).json({
        error: 'Coze API error',
        status: cozeResponse.status,
        message: cozeResponse.statusText
      });
    }

    const data = await cozeResponse.text();
    console.log('Proxy response success');
    return res.status(200).json({ data });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error'
    });
  }
} 