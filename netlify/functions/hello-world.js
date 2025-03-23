// Example Netlify serverless function
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Better Call Buffet API!",
      timestamp: new Date().toISOString()
    })
  };
} 