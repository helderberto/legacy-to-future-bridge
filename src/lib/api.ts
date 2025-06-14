
const getSystemPrompt = (fromLanguage: string, toLanguage: string) => {
  if (toLanguage.toLowerCase() === 'english') {
    return `You are an expert software architect. Your task is to analyze the provided legacy code written in ${fromLanguage} and generate a comprehensive architectural migration document.
The document should include:
1.  **Overview**: A summary of the legacy code's functionality.
2.  **Key Components**: A breakdown of the main components, classes, and functions.
3.  **Data Flow**: An explanation of how data moves through the application.
4.  **State Management**: Analysis of how state is managed.
5.  **Migration Strategy**: A recommended step-by-step plan for migrating to a modern framework.
6.  **Potential Challenges**: A list of potential issues and how to mitigate them.
Format the output as a clean, well-structured Markdown document.`;
  }
  return `You are an expert code converter. Your task is to convert the given code from ${fromLanguage} to ${toLanguage}.
- Provide only the converted code.
- Do not include any explanations, comments, or apologies.
- Ensure the generated code is clean, modern, and follows best practices for ${toLanguage}.
- If you cannot convert a specific part, leave a \`// TODO: Manual conversion required\` comment.`;
};

export const convertCode = async ({
  code,
  fromLanguage,
  toLanguage,
  apiKey,
  provider,
}: {
  code: string;
  fromLanguage: string;
  toLanguage: string;
  apiKey: string;
  provider: string;
}) => {
  if (!apiKey) {
    throw new Error(`${provider} API key is required.`);
  }

  const systemPrompt = getSystemPrompt(fromLanguage, toLanguage);
  const userPrompt = `Convert the following ${fromLanguage} code to ${toLanguage}:\n\n\`\`\`\n${code}\n\`\`\``;

  let url = '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: Record<string, any> = {};

  switch (provider) {
    case 'Perplexity':
      url = 'https://api.perplexity.ai/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
      };
      break;
    case 'OpenAI':
      url = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
      };
      break;
    case 'Claude':
      url = 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: 'claude-opus-4-20250514',
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 4096,
        temperature: 0.1,
      };
      break;
    default:
      throw new Error(`Unsupported API provider: ${provider}`);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API request to ${provider} failed with status ${response.status}`);
    }

    const data = await response.json();
    
    switch (provider) {
      case 'Perplexity':
      case 'OpenAI':
        return data.choices[0].message.content;
      case 'Claude':
        return data.content[0].text;
      default:
        throw new Error(`Unsupported response format for provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Failed to convert code with ${provider}:`, error);
    throw error;
  }
};
