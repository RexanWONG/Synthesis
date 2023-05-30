import { createCompletion } from "../gpt/createCompletion.js";

async function generateScript(prompt) {
    const script = await createCompletion(prompt)
    console.log(script)
}

generateScript(
    "You are my Youtube assistant.  Please write a script for a Youtube video about pollution.  The video will be around 2-3 minutes."
)
