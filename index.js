require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MAX_LENGTH = 5000;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';

if (!API_KEY) {
    console.error('GEMINI_API_KEY is missing in .env file');
    process.exit(1);
}

const summarizeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many requests. Please try again later.' },
});

app.use('/summarize', summarizeLimiter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Please send some text to summarize.' });
    }

    if (text.length > MAX_LENGTH) {
        return res.status(400).json({ error: 'Text must be under 5000 characters.' });
    }

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY,
            },
            body: JSON.stringify({
                contents: [
                    { parts: [{ text: `Summarize the following text in 2-3 sentences:\n\n${text}` }] },
                ],
            }),
        });

        if (!response.ok) {
            console.error('Gemini error:', await response.text());
            return res.status(502).json({ error: 'AI service failed. Try again later.' });
        }

        const data = await response.json();
        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

        res.json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong on the server.' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));