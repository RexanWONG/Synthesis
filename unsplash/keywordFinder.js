import { createCompletion } from "../gpt/createCompletion.js";

export async function findKeywords(script) {
  let keywordArray = [];

  // Split the script into sentences
  let sentences = script.match(/[^\.!\?]+[\.!\?]+/g);
  if (!sentences) {
    console.log('The script does not contain any sentences.');
    return [];
  }

  // Iterate over the sentences and find a keyword for each one
  for (let i = 0; i < sentences.length; i++) {
    let retries = 3;  // Number of times to retry the operation

    for (let j = 0; j < retries; j++) {
      try {
        const importantKeyword = await createCompletion(`
          I will give you a sentence. Choose a keyword to represent that sentence.
          The keyword will be used to search for a picture on Unsplash.
          Just write the name of the keyword.  Make it so that the keyword should be a term that can return results from unsplash.
          Here is the sentence:
          ${sentences[i]}`);

        let keyword = importantKeyword.choices[0].text.trim();
        console.log("Keyword : ", keyword);

        // push the keyword into our array
        keywordArray.push(keyword);

        // If operation was successful, break out of the retry loop
        break;
      } catch (error) {
        console.error(`Error on attempt ${j + 1}: `, error);

        // If this was the last attempt, throw the error
        if (j === retries - 1) {
          throw error;
        }

        // Wait for a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (j + 1)));
      }
    }
  }

  return keywordArray;
}
