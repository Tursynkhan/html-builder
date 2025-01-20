const fs = require('fs/promises');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputFolder, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.mkdir(outputFolder, { recursive: true });

    const files = await fs.readdir(stylesFolder, { withFileTypes: true });

    let stylesArray = [];

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf8');
        stylesArray.push(fileContent);
        console.log(`Added: ${file.name}`);
      }
    }

    await fs.writeFile(bundleFile, stylesArray.join('\n'));

    console.log('CSS bundle created successfully.');
  } catch (error) {
    console.error('Error during merging styles:', error.message);
  }
}

mergeStyles();
