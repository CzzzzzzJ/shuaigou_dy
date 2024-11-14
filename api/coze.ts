import type { VercelApiHandler } from '@vercel/node';

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
}

export default async function handler(
  request: Request,
  response: {
    setHeader: (name: string, value: string | boolean) => void;
    status: (code: number) => { json: (data: any) => void; end: () => void };
  }
) {
  // 允许跨域
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    console.log('Proxy received request:', {
      method: request.method,
      headers: request.headers,
    });

    const body = request.body as RequestBody;

    const cozeResponse = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!cozeResponse.ok) {
      console.error('Coze API error:', {
        status: cozeResponse.status,
        statusText: cozeResponse.statusText
      });
      return response.status(cozeResponse.status).json({
        error: 'Coze API error',
        status: cozeResponse.status,
        message: cozeResponse.statusText
      } as ResponseError);
    }

    const data = await cozeResponse.text();
    console.log('Proxy response success');
    return response.status(200).json({ data });
  } catch (err) {
    const error = err as Error;
    console.error('Proxy error:', error);
    return response.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error'
    } as ResponseError);
  }
} 