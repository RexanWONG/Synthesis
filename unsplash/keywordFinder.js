import { createCompletion } from "../gpt/createCompletion.js";

export async function findKeywords(script) {
  try {
    const importantKeywords = await createCompletion(`
      I will give you a script. Please return important words/keywords, logos, etc.
      These words will be represented as images in the future. Here is the script:
      ${script}

      Please list the top 10 most important keywords:
      `);

    // Extract the 10 most frequent words
    const words = importantKeywords.choices[0].text.split('\n').slice(1, -1);
    const top10Words = words.slice(0, 10);

    return top10Words;

  } catch (error) {
    console.error(error);
    return [];
  }
}
