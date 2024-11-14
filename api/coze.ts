import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CozeRequestBody {
  workflow_id: string;
  parameters: {
    user_id: string;
    text: string;
    user_input: string;
  };
}

interface ErrorResponse {
  error: string;
  message?: string;
  status?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body as CozeRequestBody;
    const cozeResponse = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!cozeResponse.ok) {
      const errorResponse: ErrorResponse = {
        error: 'Coze API error',
        status: cozeResponse.status,
        message: cozeResponse.statusText
      };
      return res.status(cozeResponse.status).json(errorResponse);
    }

    const data = await cozeResponse.text();
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Proxy error:', error);
    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
    return res.status(500).json(errorResponse);
  }
} 