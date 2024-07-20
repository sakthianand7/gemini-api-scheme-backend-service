const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const app = express()
const port = 8000
const cors = require('cors');

dotenv.config();
const geminiAPI = new GoogleGenerativeAI('');

const HOMEPAGE_PROMPT = `
Top 5 government schemes with high public interest or social impact India using this JSON schema:
{ "type": "object",
  "properties": {
    "name": { "type": "string" },
    "description": { "type": "string" },
    "eligibility": { "type": "string" },
    "website_url": { "type": "string" }
  }
}`;

const ELIGIBILITY_CHECK_PROMPT = `
Check the eligibility of the government scheme for the above profile using this JSON scheme:
{ "type": "object",
  "properties": {
    "eligibility": { "type": "boolean" },
    "reason": { "type": "string" }
  }
}
`

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

app.get('/search', async (req, res) => {
  try {
    const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(HOMEPAGE_PROMPT);
    const response = await result.response;
    let text = "[" + response.text() + "]";
    let schemes = JSON.parse(text);
    res.json(schemes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing your request");
  }
});
app.post('/chat', async (req, res) => {
  const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });
  const data = req.body;
  const prompt = JSON.stringify(data) + "," + ELIGIBILITY_CHECK_PROMPT;
  console.log(prompt);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log('Received data:', response.text());

  res.status(201).send(JSON.parse(text));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});