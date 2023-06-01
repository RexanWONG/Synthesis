import { createCompletion } from "../gpt/createCompletion.js";

export async function findKeywords(script) {
  let keywordArray = []; 
  try {
    const importantKeywords = await createCompletion(`
      I will give you a script. For each sentence, choose a keyword to represent that sentence.
      The keyword will be used to search for a picture on unsplash.  Seperate each keyword with a comma.  
      Here is the script:
      ${script}`);

    let keywords = (importantKeywords.choices[0].text).split(',');

    for (let i = 0; i < keywords.length; i++) {
      keywordArray.push(keywords[i].trim()); // push each keyword into our array
    }

  } catch (error) {
    console.error(error);
    return [];
  }

  return keywordArray; 
}

