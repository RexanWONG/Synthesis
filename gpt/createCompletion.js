import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: `${__dirname}/../.env` });

const API_KEY = process.env.OPENAI_API_KEY

async function createCompletion() {
    console.log(API_KEY)
  try {
    const APIBody = {
      model: 'text-davinci-003',
      prompt: `You are my Youtube assistant.  
      Please write a script for a Youtube video about pollution.  T
      he video will be around 2-3 minutes.`,
      max_tokens: 200,
      temperature: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
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
    console.log(data)


  } catch (error) {
    console.error(error)
  }
}

createCompletion();