const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

async function main() {
  const script = await readScript();
  const numSentences = countSentences(script);

  const promises = [];
  for (let i = 1 ; i <= numSentences ; i++) {
    const audioPath = `../assets/narrations/${i}_narration.mp3`;
    const duration = await getAudioDurationInSeconds(audioPath);

    const promise = new Promise((resolve, reject) => {   
      ffmpeg()
        .input(`../assets/images/${i}_image/${i}.jpg`)
        .loop(duration)
        .input(audioPath)
        .audioCodec('copy')
        .audioBitrate('192k')
        .on('end', function() {
          console.log(`🚀 Video ${i} created`);
          resolve();
        })
        .on('error', function(err) {
          console.log('an error happened: ' + err.message);
          reject(err);
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
        .videoFilters({
          filter: 'scale',
          options: 'trunc(iw/2)*2:trunc(ih/2)*2' // Ensures that both width and height are divisible by 2
        })
        .format('mp4')
        .run();
    });
    promises.push(promise);
  }

  Promise.all(promises)
    .then(() => checkAndConcatVideos(numSentences))
    .catch(err => console.error(err));
}

async function checkAndConcatVideos(numSentences) {
  try {
    const files = await fs.promises.readdir('../assets/outputs');

    // Filter out non-MP4 files
    const mp4Files = files.filter(file => path.extname(file) === '.mp4');

    if (mp4Files.length === numSentences) {
      // Sorting mp4Files to maintain the correct order
      const sortedMp4Files = mp4Files.sort((a, b) => {
        const aNumber = Number(a.split('_')[0]);
        const bNumber = Number(b.split('_')[0]);
        return aNumber - bNumber;
      });

      const videoFiles = sortedMp4Files.map(file => `../assets/outputs/${file}`);
      
      // Write a temporary list file for ffmpeg
      const list = videoFiles.map(file => `file '${file}'`).join('\n');
      await fs.promises.writeFile('temp.txt', list);

      ffmpeg()
        .input('temp.txt')
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .audioCodec('copy')
        .audioBitrate('192k')
        .outputOptions(['-c', 'copy'])
        .on('end', function() {
          console.log('All videos combined into one!');
          // Delete the temporary list file
          fs.unlink('temp.txt', err => {
            if (err) {
              console.error('Could not delete temporary list file:', err);
            }
          });
        })
        .on('error', function(err) {
          console.log('An error occurred: ' + err.message);
        })
        .output('../assets/outputs/combined.mp4')
        .run();
    }
  } catch (err) {
    console.error(err);
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
