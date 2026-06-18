export const sendMessageTo9Router = async (messages, endpoint, modelName, onChunk) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 9Router doesn't strictly need a real API key, but OpenAI clients expect one
        'Authorization': `Bearer dummy-key`, 
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.includes('[DONE]')) return fullContent;
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
              const content = data.choices[0].delta.content;
              fullContent += content;
              if (onChunk) {
                onChunk(content);
                // Jeda buatan antar potongan teks agar animasi ngetik terlihat nyata (typewriter effect)
                await new Promise((resolve) => setTimeout(resolve, 15));
              }
            }
          } catch (e) {
            console.error('Error parsing stream chunk', e);
          }
        }
      }
    }
    return fullContent;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
