// File: netlify/functions/generate-sentence.js

exports.handler = async function(event, context) {
  // 1. Prendi la chiave API segreta dalle impostazioni di Netlify.
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Prendi la difficoltà richiesta dal sito web.
  const { difficulty } = JSON.parse(event.body);

  // 3. Prepara la richiesta da inviare a Google (la stessa che avevi prima).
  const prompt = `Sei un esperto di grammatica italiana per studenti di scuola media... Genera UNA frase in italiano... adatta a un livello di difficoltà "${difficulty}". ... Fornisci la risposta ESCLUSIVAMENTE in formato JSON...`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    // 4. L'intermediario (Netlify) chiama Google.
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    // 5. Invia la risposta di Google al sito web.
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    // In caso di errore, lo comunica al sito web.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
