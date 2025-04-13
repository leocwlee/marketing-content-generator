// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// --- Configuration ---
const PORT = process.env.PORT || 3001; // Use port from env variable or default to 3001
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Define a default model or allow selection via request? For now, let's hardcode one.
// See https://openrouter.ai/docs#models for options
const DEFAULT_MODEL = "google/gemini-2.0-flash-001"; // Example model

if (!OPENROUTER_API_KEY) {
    console.error("FATAL ERROR: OPENROUTER_API_KEY environment variable is not set.");
    // In a real app, you might exit or prevent startup, but for now, just log.
}

// --- API Routes ---

// POST /api/generate - Endpoint to handle content generation requests
app.post('/api/generate', async (req, res) => {
    console.log("Received request:", req.body); // Log incoming request body

    const { contentType, tone, language, length, includeEmoji, context } = req.body;

    // Basic validation
    if (!contentType || !tone || !language || !length || includeEmoji === undefined) {
        return res.status(400).json({ error: 'Missing required fields: contentType, tone, language, length, includeEmoji' });
    }

    if (!OPENROUTER_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
    }

    // Construct the prompt for the AI model
    // This is a crucial part and needs careful crafting based on requirements.
    // Example prompt structure:
    const prompt = `
You are a marketing content generator for a commercial bank serving SME (Small and Medium-sized Enterprise) customers.
Generate marketing content based on the following specifications:
- Content Type: ${contentType}
- Tone: ${tone} ${tone === 'Hong Kong local style' ? '(incorporate Cantonese slang or common HK expressions appropriately if applicable)' : ''}
- Language: ${language}
- Length: ${length}
- Target Audience: SME Customers
${context ? `- Additional Context/Keywords: ${context}` : ''}

Please generate the content now. Output only the generated content itself, without any introductory phrases like "Here is the content:".
    `;

    console.log("Constructed Prompt:", prompt); // Log the prompt being sent

    try {
        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: DEFAULT_MODEL, // Or get model from request if needed
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful marketing assistant for a bank. Generate content that is ${length.toLowerCase()} in length. ${includeEmoji ? 'Include relevant emojis where appropriate.' : 'Do not include any emojis.'} Format the content using markdown with appropriate headings, bullet points, and emphasis.`
                    },
                    { role: "user", content: prompt }
                ],
                // Add other OpenRouter parameters if needed (temperature, max_tokens, etc.)
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    // OpenRouter specific headers if any (check their docs)
                    // 'HTTP-Referer': $YOUR_SITE_URL, // Optional, for tracking
                    // 'X-Title': $YOUR_SITE_NAME, // Optional, for tracking
                }
            }
        );

        console.log("OpenRouter API Response Status:", response.status);
        // console.log("OpenRouter API Response Data:", response.data); // Be careful logging full data if sensitive

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const generatedContent = response.data.choices[0].message?.content?.trim();
            if (generatedContent) {
              console.log("Generated Content:", generatedContent);
              // Ensure markdown formatting is preserved
              res.json({ generatedContent, isMarkdown: true });
            } else {
                console.error("Error: No content found in OpenRouter response structure.");
                res.status(500).json({ error: 'Failed to extract content from AI response.' });
            }
        } else {
            console.error("Error: Invalid response structure from OpenRouter:", response.data);
            res.status(500).json({ error: 'Invalid response structure from AI service.' });
        }

    } catch (error) {
        console.error("Error calling OpenRouter API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate content via AI service.', details: error.response ? error.response.data : error.message });
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});