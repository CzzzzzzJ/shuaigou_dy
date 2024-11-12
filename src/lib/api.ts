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