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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch('https://api.coze.com/v1/workflow/stream_run', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_COZE_REWRITE_API_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
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
          mode: 'cors',
          credentials: 'omit',
          timeout: 60000,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Raw API response:', responseText);

        if (!responseText) {
          throw new Error('Empty response');
        }

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
                  
                  if (!content.output || typeof content.output !== 'string' || content.output.length < 10) {
                    throw new Error('Invalid content format');
                  }
                  
                  clearTimeout(timeoutId);
                  return { content: content.output };
                } catch (parseError) {
                  console.error('Parse error:', parseError);
                  throw new Error('Response format error');
                }
              }
            }
          }
        }

        throw new Error('No valid content found');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          continue;
        }
        throw lastError;
      }
    }

    throw new Error('Max retries exceeded');
  } catch (error: unknown) {
    console.error('API error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请重试');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('网络请求失败，请检查网络连接');
      }
      throw new Error(error.message || '生成失败，请重试');
    }
    
    if (!navigator.onLine) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    
    throw new Error('未知错误，请重试');
  } finally {
    controller.abort();
  }
}