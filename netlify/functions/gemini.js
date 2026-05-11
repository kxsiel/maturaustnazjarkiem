const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Nagłówki zapobiegające błędom CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const API_KEY = "AIzaSyAbqkqGbRl1jaj65Jh3FLQR9w3wj1X6kgs";
    const { system, messages } = JSON.parse(event.body);
    
    // Łączymy system prompt i wiadomość użytkownika dla Gemini
    const promptText = `${system}\n\n${messages[0].content}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message);

    const aiResponse = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: [{ text: aiResponse }]
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};