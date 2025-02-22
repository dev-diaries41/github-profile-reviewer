import fs from 'fs';
import path from 'path';
import https from 'https';

export async function saveFile(data: string | Buffer | Uint8Array, filename: string, encoding?: BufferEncoding): Promise<void> {
  const dir = path.dirname(filename);

  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
  }

  await fs.promises.writeFile(filename, data, { encoding });
  console.log('Data saved to', filename);
}


export async function readFile(filename: string): Promise<string> {
  return await fs.promises.readFile(filename, 'utf8');
}

export async function downloadFile(url: string, filePath: string): Promise<string> {
  const dirPath = path.dirname(filePath);

  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
      https.get(url, (res) => {
          const fileStream = fs.createWriteStream(filePath);

          res.pipe(fileStream);

          // Handle stream errors
          res.on('error', (err) => reject(`Error downloading file: ${err.message}`));
          fileStream.on('finish', () => resolve(`File downloaded successfully to ${filePath}`));
      }).on('error', (err) => reject(`Error with the HTTPS request: ${err.message}`));
  });
}


 export  async function downloadsAllFiles(filePath: string){
    const urls: string[] = JSON.parse(await readFile(filePath)).results;
    const downloadPromises = urls.map(url => {
        const fileName = getFileName(url);
        if(!fileName)throw new Error('Invalid file name');
        const filePath = `results/${fileName}`
        return downloadFile(url, filePath)
    })
    await Promise.all(downloadPromises);
}


  function getFileName(url: string){
    const fileName = url.split('/')?.pop()?.trim();
    return fileName
}

  
  export async function readDirectory(directoryPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filePaths = files.map((file) => path.join(directoryPath, file));
          resolve(filePaths);
        }
      });
    });
  }


export function getImageAsBase64(filePath: string) {
  const imageFile = fs.readFileSync(filePath);
  const base64Image = `data:image/${filePath.split('.').pop()};base64,${imageFile.toString('base64')}`;
  return base64Image;
}


async function readLines(readStream: fs.ReadStream): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const items: string[] = [];
    let buffer = '';

    readStream.on('data', chunk => {
      buffer += chunk;

      const lines = buffer.split('\n');
      buffer = lines.pop() || buffer; 

      items.push(...lines.map(line => line.trim()).filter(line => line !== ''));
    });

    readStream.on('end', () => {
      if (buffer.trim()) {
        items.push(buffer.trim());
      }
      resolve(items);
    });

    readStream.on('error', err => reject('Error reading the file: ' + err.message));
  });
}


export async function extractItems(filePath: string, n: number = Infinity): Promise<string[]> {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

    const items = await readLines(readStream);
    const slicedItems = items.slice(-n);
    const remainingItems = items.slice(0, -n);

    // We will now write the remaining items asynchronously
    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
      writeStream.write(remainingItems.join('\n'), (err) => {
        if (err) {
          reject(new Error('Error writing the file: ' + err.message));
        }
      });

      writeStream.on('finish', () => resolve());
      writeStream.end();
    });

    return slicedItems;
}

export async function extractCredentialsFromLogs(logFilePath: string, type: string): Promise<string[]> {
    const readStream = fs.createReadStream(logFilePath, { encoding: 'utf8' });
    const logLines = await readLines(readStream);
    const credentials = logLines
      .filter(line => {
        try {
          const log = JSON.parse(line);
          return log.message === type;
        } catch (e) {
          return false;
        }
      })
      .map(line => {
        try {
          const log = JSON.parse(line);
          return log.metadata.credential;
        } catch (e) {
          return null;
        }
      })
      .filter(credential => credential !== null);

    return credentials as string[]
}

export async function formatCredentials(filePath: string): Promise<void> {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

  const items = await readLines(readStream);
  const updatedItems = items.map(item => item.startsWith('61') ? '+61' + item.slice(2) : item);

  // We will now write the remaining items asynchronously
  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
    writeStream.write(updatedItems.join('\n'), (err) => {
      if (err) {
        reject(new Error('Error writing the file: ' + err.message));
      }
    });

    writeStream.on('finish', () => resolve());
    writeStream.end();
  });

}

export async function removeItems(filePath: string, itemsToRemove: string[]): Promise<void> {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

  const items = await readLines(readStream);
  const updatedItems = items.filter(item => !itemsToRemove.includes(item));

  // We will now write the remaining items asynchronously
  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
    writeStream.write(updatedItems.join('\n'), (err) => {
      if (err) {
        reject(new Error('Error writing the file: ' + err.message));
      }
    });

    writeStream.on('finish', () => resolve());
    writeStream.end();
  });

}


export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
    // console.log(`File deleted successfully: ${filePath}`);
  } catch (err: any) {
    // console.error(`Error deleting file: ${err?.message}`);
  }
}
