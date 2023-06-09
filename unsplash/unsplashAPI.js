import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';
import fs from 'fs';

export class Unsplash {
  constructor(accessKey) {
    // Create an instance of the Unsplash API using the provided access key
    this.unsplash = createApi({ accessKey, fetch });
  }

  async getPhoto(type, query, imageNumber, page = 1, per_page = 8, orientation = 'landscape', retryCount = 0) {
    try {
      // Send a request to the Unsplash API to search for photos
      const response  = await this.unsplash.search.getPhotos({
        query,
        page,
        per_page,
        orientation,
      });

      // Select a random photo from the response
      const aRandomPhoto = response.response.results[Math.floor(Math.random() * 8)];
      // Get the regular size photo url
      const photoUrl = aRandomPhoto.urls.regular;
      // Fetch the photo
      const photo = await fetch(photoUrl);
      // Get the photo buffer
      const photoBuffer = await photo.arrayBuffer();
      // Create caption for the photo - in Unsplash attribution style
      const caption = `
        <a style="text-decoration: none; cursor: default; pointer-events: none; color: inherit;">
          Photo by
        </a>
        <a href="${aRandomPhoto.user.links.html}" rel="noopener ugc nofollow" target="_blank">
          ${aRandomPhoto.user.name}
        </a>
        on
        <a href="https://unsplash.com" rel="noopener ugc nofollow" target="_blank">
          Unsplash
        </a>
      `;

      // Check the value of the "type" parameter and execute the corresponding code block
      switch (type) {
        case 'buffer':
          // Convert the photo buffer to Uint8Array
          const data = new Uint8Array(photoBuffer);
          console.log(`Image ${imageNumber}.jpg buffer ready`);
          // Return an object containing the photo's buffer and attributes
          return {
            attributes: {
              caption: caption,
              title: query.toLowerCase(),
              alt_text: `an image of ${query.toLowerCase()}`,
            },
            buffer: data
          };
        case 'file':
          // Convert the photo buffer to a Buffer
          const image = Buffer.from(photoBuffer);
          // Create a new directory for the photo based on its imageNumber
          const dirPath = `../assets/images/${imageNumber}_image`;
          // If the directory doesn't exist, create it
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
          }
          // Create a file path for the photo in the new directory
          const filePath = `${dirPath}/${imageNumber}.jpg`
          // Write the photo to the file system in the new directory
          await fs.promises.writeFile(filePath, image);
          console.log(`Image ${imageNumber}.jpg saved`);
          break;
        default:
          console.log(`Invalid type: ${type}`);
          return null;
      }
    } catch (error) {
      console.log(`Error occurred while fetching image for ${query}: ${error}`);

      // Retry if error occurs, maximum of 3 attempts
      if (retryCount < 3) {
        console.log(`Retrying fetch for ${query}. Attempt ${retryCount + 1}`);
        return this.getPhoto(type, query, imageNumber, page, per_page, orientation, retryCount + 1);
      } else {
        console.log(`Failed to fetch image for ${query} after ${retryCount} attempts.`);
        return null;
      }
    }
  }
}
