
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
}: {
  code: string;
  fromLanguage: string;
  toLanguage: string;
  apiKey: string;
}) => {
  if (!apiKey) {
    throw new Error("Perplexity API key is required.");
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(fromLanguage, toLanguage),
          },
          {
            role: 'user',
            content: `Convert the following ${fromLanguage} code to ${toLanguage}:\n\n\`\`\`\n${code}\n\`\`\``
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Failed to convert code:", error);
    throw error;
  }
};
