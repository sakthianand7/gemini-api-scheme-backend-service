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

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/search', async (req, res) => {    
    try {
      const model = geminiAPI.getGenerativeModel({model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" }});
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
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });