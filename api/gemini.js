// api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const API_KEY = "AIzaSyAbqkqGbRl1jaj65Jh3FLQR9w3wj1X6kgs";
  const { system, messages } = req.body;

  // Łączymy system prompt z treścią użytkownika dla modelu Gemini
  const prompt = `${system}\n\nUżytkownik: ${messages[0].content}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          // Gemini zwraca tekst, który musimy sparsować jako JSON w przeglądarce
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiText = data.candidates[0].content.parts[0].text;
    
    // Zwracamy format, którego oczekuje Twój index.html
    res.status(200).json({
      content: [{ text: aiText }]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera AI: " + error.message });
  }
}
