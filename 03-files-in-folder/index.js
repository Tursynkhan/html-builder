const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function listFiles() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.stat(filePath);

        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        const sizeKB = (stats.size / 1024).toFixed(3);

        console.log(`${name} - ${ext.slice(1)} - ${sizeKB}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
}

listFiles();
