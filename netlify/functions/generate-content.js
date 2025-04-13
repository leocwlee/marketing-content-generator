const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { contentType, tone, language, length, includeEmoji, context } = body;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    // Input validation
    if (!OPENROUTER_API_KEY) {
      throw new Error('API key not configured');
    }

    // Construct prompt similar to your backend
    const prompt = `Generate ${contentType} content for SME banking customers.
      Tone: ${tone} 
      Language: ${language}
      Length: ${length}
      ${context ? `Context: ${context}` : ''}`;
    
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a banking marketing assistant. ${includeEmoji ? 'Include relevant emojis.' : 'No emojis.'}`
        },
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        generatedContent: response.data.choices[0].message.content 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Content generation failed',
        details: error.message 
      })
    };
  }
};
