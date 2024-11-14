interface ExtractResponse {
  content: string;
  title: string;
}

interface ApiResponse {
  content: string;
  content_type: string;
  cost: string;
  node_is_finish: boolean;
  node_seq_id: string;
  node_title: string;
  token: number;
}

export async function extractDouyinContent(url: string): Promise<ExtractResponse> {
  try {
    const response = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COZE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: import.meta.env.VITE_COZE_WORKFLOW_ID,
        parameters: {
          user_id: "default",
          BOT_USER_INPUT: url
        }
      })
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Failed to get response reader');

    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(5));
            if (data.content) {
              const content = JSON.parse(data.content);
              if (content.content && content.title) {
                return {
                  content: content.content,
                  title: content.title
                };
              }
            }
          } catch (e) {
            console.error('Failed to parse response chunk:', e);
          }
        }
      }
    }
    
    throw new Error('No valid content found in response');
  } catch (error) {
    console.error('Error extracting content:', error);
    throw error;
  }
}

// 文案仿写接口
export async function rewriteContent(text: string, userInput: string) {
  console.log('Calling rewrite API with:', { text, userInput });

  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    const response = await fetch('https://api.coze.com/v1/workflow/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COZE_REWRITE_API_TOKEN}`,
        'Content-Type': 'application/json',
        // 添加移动端 UA
        'User-Agent': navigator.userAgent,
      },
      body: JSON.stringify({
        workflow_id: import.meta.env.VITE_COZE_REWRITE_WORKFLOW_ID,
        parameters: {
          user_id: "default_user",
          text: text,
          user_input: userInput
        }
      }),
      signal: controller.signal,
      // 添加跨域设置
      mode: 'cors',
      credentials: 'omit'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      throw new Error('API_ERROR');
    }

    const responseText = await response.text();
    console.log('Raw API response:', responseText);

    if (!responseText) {
      throw new Error('Empty response');
    }

    // 处理 SSE 格式的响应
    const events = responseText.split('\n\n').filter(Boolean);
    console.log('Parsed events:', events);

    for (const event of events) {
      if (event.includes('"node_title":"End"')) {
        const lines = event.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = JSON.parse(data.content);
              console.log('Parsed content:', content);
              return { content: content.output };
            } catch (parseError) {
              console.error('Parse error:', parseError);
              throw new Error('Invalid response format');
            }
          }
        }
      }
    }

    throw new Error('No valid content found in response');
  } catch (error) {
    console.error('API error:', error);
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请重试');
    }
    if (!navigator.onLine) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    throw error;
  }
}