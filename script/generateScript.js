import { createCompletion } from "../gpt/createCompletion.js";
import { sustainabilityTopics } from "../constants/listOfTopics.js";

function getRandomTopic() {
    const randomIndex = Math.floor(Math.random() * sustainabilityTopics.length);
    return sustainabilityTopics[randomIndex];
}

async function generateScript(prompt) {
    const script = await createCompletion(prompt)
    console.log(script)
}

generateScript(
    `You are my Youtube assistant. 
    Please write a script for a Youtube video about a random topic of your choice related to ${getRandomTopic}.  
    The video will be around 2-3 minutes.`
)
