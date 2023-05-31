import { Unsplash } from "./unsplashAPI.js";
import { findKeywords } from "./keywordFinder.js";
import { readFile } from "fs";
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: `${__dirname}/../.env` });

async function main() {
    const script = await readScript()
    const keywords = await findKeywords(script)

    for (let i = 0 ; i < keywords.length ; i++) {
        const unsplash = new Unsplash(process.env.UNSPLASH_ACCESS_KEY);
        await unsplash.getPhoto('file', keywords[i]);
    }
}

async function readScript() {
    const data = await new Promise((resolve, reject) => {
        readFile('../assets/script.txt', 'utf8', (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });

    return data
}

main()
