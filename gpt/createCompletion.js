import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: `${__dirname}/../.env` });

const API_KEY = process.env.OPENAI_API_KEY

export async function createCompletion(prompt) {
  try {
    const APIBody = {
      'model': 'text-davinci-003',
      'prompt': prompt,
      'max_tokens': 400,
      'temperature': 0.6,
      'frequency_penalty': 0.0,
      'presence_penalty': 0.0,
    }

    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY
        }, 

        body: JSON.stringify(APIBody)
    })

    const data = await response.json();

    return data

  } catch (error) {
    console.error(error)
  }
}
