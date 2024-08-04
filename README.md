---

# Government Scheme Navigator backend

## Overview

This Express-based API leverages Google's Generative AI to interact with government schemes. It offers functionalities to manage user profiles, perform chat interactions, and search for government schemes based on various criteria.

## Features

- **Feed Profile**: Upload user profile data to the AI.
- **Chat**: Engage in conversations with the AI.
- **Search Schemes**: Fetch a list of featured government schemes.
- **Check Eligibility**: Verify if a scheme is suitable based on profile data.
- **Search Schemes for Profile**: Find schemes that match a specific user profile.
- **Compare Schemes**: Obtain a detailed comparison of multiple schemes.
- **Manage Profiles**: Add, update, or retrieve user profiles.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Google Generative AI API key

### Installation

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Replace with your API Key**

    ```plaintext
    const geminiAPI = new GoogleGenerativeAI(<YOUR API KEY>);
    ```
    Note: Don't commit your API key, instead use env variables. More details: https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node

4. **Start the Server**

    ```bash
    node index.js
    ```

    The server will start on port `8000` by default.

## API Endpoints

### `GET /feedProfile`

Feeds profile data into the AI.

**Responses:**

- `201`: Success
- `500`: Error processing request

### `POST /chat`

Sends a chat message to the AI.

**Request Body:**

```json
{
  "message": "Your message here"
}
```

**Responses:**

- `201`: Success
- `500`: Error processing request

### `GET /search`

Retrieves a list of featured government schemes.

**Responses:**

- `200`: List of schemes
- `500`: Error processing request

### `POST /checkEligibility`

Checks the eligibility of a scheme for the given profile.

**Request Body:**

```json
{
  "schemeName": "Scheme Name",
  "eligibility": true,
  "reason": "Reason here"
}
```

**Responses:**

- `201`: Success
- `500`: Error processing request

### `POST /searchScheme`

Searches for schemes matching a profile.

**Request Body:**

```json
{
  "profile": "Profile data here"
}
```

**Responses:**

- `201`: Success
- `500`: Error processing request

### `POST /compareSchemes`

Compares multiple schemes and returns a detailed comparison.

**Request Body:**

```json
{
  "schemes": ["Scheme 1", "Scheme 2"]
}
```

**Responses:**

- `201`: Success
- `500`: Error processing request

### `GET /getProfiles/:userName`

Retrieves profiles for a specific user.

**Responses:**

- `200`: List of profiles
- `404`: User or profile not found

### `POST /addProfile/:userName`

Adds a new profile entry for a user.

**Request Body:**

```json
{
  "id": "Profile ID",
  "name": "Profile Name"
}
```

**Responses:**

- `201`: Entry added successfully
- `404`: User not found or entry could not be added

### `PUT /updateProfile/:userName/:profileName`

Updates an existing profile entry for a user.

**Request Body:**

```json
{
  "name": "Updated Name"
}
```

**Responses:**

- `200`: Entry updated successfully
- `404`: User or profile not found

## Utility Functions

- **`readJsonFile(filePath)`**: Reads JSON data from a file.
- **`writeJsonFile(filePath, data)`**: Writes JSON data to a file.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. Ensure that your changes follow the existing coding style.

---
