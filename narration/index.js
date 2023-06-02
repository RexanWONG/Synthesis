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

  console.log('Script read successfully:', script);

  // Call the textToSpeech function to generate the audio data for the script read from the file
  const data = await textToSpeech(script);

  // Write the data to a .mp3 file
  fs.writeFile('../assets/narration.mp3', Buffer.from(data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully');
    }
  });
};

main()
