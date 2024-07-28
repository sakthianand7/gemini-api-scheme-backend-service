const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const app = express()
const port = 8000
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'profile.json');

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
Check the eligibility of the government scheme for the above profile(check all the fields) using this JSON scheme:
{ "type": "object",
  "properties": {
    "schemeName": { "type": "string" },
    "eligibility": { "type": "boolean" },
    "reason": { "type": "string" }
  }
}
`
const SEARCH_QUERY_PROMPT = `
multiple matching schemes for the query mentioned in the above json for the above profile using this JSON scheme:
{ "type": "object",
  "properties": {
    "schemeWebsiteUrl" : {"type": "string"},
    "schemeName": { "type": "string" },
    "schemeDetails" : {"type": "string"},
    "eligible": { "type": "boolean" },
    "reason": { "type": "string" }
  }
}
`


app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());


/**
 * Model for chat
 */
const chatModel = geminiAPI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = chatModel.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 500
  }
});

/**
 * Feeds the available to Gemini chat
 */

app.get('/feedProfile', async (req, res) => {
  try {
    const profile = readJsonFile(filePath);
    const result = await chat.sendMessage("Remember these profiles" + JSON.stringify(profile));
    const response = await result.response;
    const text = await response.text();
    res.status(201).send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing your request");
  }
});

/**
 * Chat functionality
 */

app.post('/chat', async (req, res) => {
  const message = req.body.message
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = await response.text();
  res.status(201).send(text);
});


/**
 * Search API to get featured schemes
 */
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

/**
 * Check eligibility of featured schemes
 */
app.post('/checkEligibility', async (req, res) => {
  const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });
  const data = req.body;
  const prompt = JSON.stringify(data) + "," + ELIGIBILITY_CHECK_PROMPT;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  res.status(201).send(JSON.parse(text));
});

/**
 * Search schemes for a profile
 */
app.post('/searchScheme', async (req, res) => {
  const model = geminiAPI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });
  const data = req.body;
  const prompt = JSON.stringify(data) + "," + SEARCH_QUERY_PROMPT;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  if (!text.startsWith("[")) {
    text = "[" + text + "]";
  }
  res.status(201).send(JSON.parse(text));
});

/**
 * Get Profiles for an user
 */
app.get('/getProfiles/:userName', (req, res) => {
  const key = req.params.userName;
  const data = readJsonFile(filePath);

  if (data && data[key] && Array.isArray(data[key])) {
    res.json(data[key]);
  } else {
    res.status(404).json({ message: `${key} is missing or not an array.` });
  }
});

/**
 * Add a new profile
 */
app.post('/addProfile/:userName', (req, res) => {
  const key = req.params.userName;
  const newEntry = req.body;
  const data = readJsonFile(filePath);

  if (data && data[key] && Array.isArray(data[key])) {
    data[key].push(newEntry);
    writeJsonFile(filePath, data);
    res.status(201).json({ message: 'New entry added successfully' });
  } else {
    res.status(404).json({ message: `${key} key is missing or not an array.` });
  }
});


/**
 * Update profile
 */
app.put('/updateProfile/:userName/:profileName', (req, res) => {
  const key = req.params.userName;
  const id = req.params.profileName;
  const updatedEntry = req.body;
  const data = readJsonFile(filePath);

  if (data && data[key] && Array.isArray(data[key])) {
    const entries = data[key];
    const entryIndex = entries.findIndex(entry => entry.id === id);

    if (entryIndex !== -1) {
      entries[entryIndex] = { ...entries[entryIndex], ...updatedEntry };
      writeJsonFile(filePath, data);
      res.json({ message: 'Entry updated successfully' });
    } else {
      res.status(404).json({ message: `Entry with id ${id} not found.` });
    }
  } else {
    res.status(404).json({ message: `${key} key is missing or not an array.` });
  }
});

/**
 * Start the server
 */

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


/**
 * Utility method to read from JSON
 * @param {*} filePath file
 * @returns JSON
 */
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
};

/**
 * Utility function to write data into a JSON fil
 * @param {*} filePath file path
 * @param {*} data data to write
 */

const writeJsonFile = (filePath, data) => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log('File written successfully');
  } catch (err) {
    console.error('Error writing the file:', err);
  }
};