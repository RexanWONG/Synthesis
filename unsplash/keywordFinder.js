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
    try {
      const importantKeyword = await createCompletion(`
        I will give you a sentence. Choose a keyword to represent that sentence.
        The keyword will be used to search for a picture on Unsplash.
        Just write the name of the keyword.
        Here is the sentence:
        ${sentences[i]}`);

      let keyword = importantKeyword.choices[0].text.trim();
      console.log("Keyword : ", keyword)

      // push the keyword into our array
      keywordArray.push(keyword);

    } catch (error) {
      console.error(error)
    }
  }

  return keywordArray;
}


