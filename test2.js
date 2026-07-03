

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "HTTP-Referer": "http://localhost",
    "X-Title": "test-app",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  }),
});

const data = await response.json();
console.log(data);