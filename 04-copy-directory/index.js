const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  try {
    const sourceDir = path.join(__dirname, 'files');
    const targetDir = path.join(__dirname, 'files-copy');

    await fs.mkdir(targetDir, { recursive: true });

    const targetFiles = await fs.readdir(targetDir);
    for (const file of targetFiles) {
      await fs.unlink(path.join(targetDir, file));
    }

    const sourceFiles = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const file of sourceFiles) {
      if (file.isFile()) {
        const srcPath = path.join(sourceDir, file.name);
        const destPath = path.join(targetDir, file.name);

        await fs.copyFile(srcPath, destPath);
        console.log(`Copied: ${file.name}`);
      }
    }

    console.log('Copy completed successfully.');
  } catch (error) {
    console.error('Error during directory copy:', error.message);
  }
}

copyDir();
