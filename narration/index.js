import textToSpeech from "./elevenlabs.js";
import fs from 'fs';

const main = async () => {
  // Read the contents of the text file
  const script = fs.readFileSync('../assets/script.txt', 'utf-8');

  // Check if script is not empty
  if (!script || script.trim() === '') {
    console.error('Error: Script is empty');
    return;
  }

  console.log('Script read successfully');

  // Split the script into sentences
  const sentences = script.split(/[.?!]+/).map(sentence => sentence.trim()).filter(Boolean);

  for (let i = 0; i < sentences.length; i++) {
    console.log(`Processing sentence ${i+1}: ${sentences[i]}`);

    // Call the textToSpeech function to generate the audio data for each sentence
    const data = await textToSpeech(sentences[i]);

    // Write the data to a .mp3 file named as {sentenceNum}_narration.mp3
    fs.writeFile(`../assets/narrations/${i+1}_narration.mp3`, Buffer.from(data), (err) => {
      if (err) {
        console.error(`Error writing file for sentence ${i+1}:`, err);
      } else {
        console.log(`File written successfully for sentence ${i+1}`);
      }
    });
  }
};

main();
