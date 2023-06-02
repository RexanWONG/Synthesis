const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg');

async function main() {
  const script = await readScript()
  const numSentences = countSentences(script)

  for (let i = 1 ; i <= numSentences ; i++) {
    const audioPath = `../assets/narrations/${i}_narration.mp3`
    const duration = await getAudioDurationInSeconds(audioPath);
 
    ffmpeg()
    .input(`../assets/images/${i}_image/${i}.jpg`)
    .loop(duration)
    .input(audioPath)
    .audioCodec('copy')
    .audioBitrate('192k')
    .on('end', function() {
      console.log('🚀 Video created');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .output(`../assets/outputs/${i}_output.mp4`)
    .outputOptions([
      '-c:v', 
      'libx264',
      '-pix_fmt', 
      'yuv420p',
      '-b:a',
      '192k',
      '-shortest',
    ])
    .format('mp4')
    .run();
  }
}

function getAudioDurationInSeconds(audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) { reject(err); return; }
      resolve(metadata.format.duration);
    });
  });
}

function countSentences(text) {
  // Define the sentence ending characters
  var sentenceEnders = /[.!?]/g;

  // Split the text by the sentence enders and remove empty strings
  var sentences = text.split(sentenceEnders).filter(Boolean);
  
  // Return the count
  return sentences.length;
}

async function readScript() {
  try {
    const data = await fs.promises.readFile('../assets/script.txt', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
}

main()
