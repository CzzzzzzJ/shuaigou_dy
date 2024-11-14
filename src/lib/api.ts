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
  try {
    // 使用完整的 API 路径
    const response = await fetch('/api/coze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COZE_REWRITE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: import.meta.env.VITE_COZE_REWRITE_WORKFLOW_ID,
        parameters: {
          user_id: "default_user",
          text,
          user_input: userInput
        }
      })
    });

    if (!response.ok) {
      throw new Error(`代理服务器请求失败: ${response.status}`);
    }

    const { data } = await response.json();
    return handleResponse(data);
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

// 处理响应数据的辅助函数
function handleResponse(responseText: string) {
  if (!responseText) {
    throw new Error('返回内容为空');
  }

  try {
    const events = responseText.split('\n\n').filter(Boolean);
    console.log('Processing response events:', events.length);
    
    for (const event of events) {
      if (event.includes('"node_title":"End"')) {
        const lines = event.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            const content = JSON.parse(data.content);
            return { content: content.output };
          }
        }
      }
    }

    throw new Error('未找到有效的返回内容');
  } catch (error) {
    console.error('Response parsing error:', error);
    throw new Error('返回内容格式错误');
  }
}