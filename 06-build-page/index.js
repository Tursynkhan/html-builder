const fs = require('fs/promises');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');

async function createDistFolder() {
  await fs.mkdir(distFolder, { recursive: true });
}

async function buildHTML() {
  try {
    let templateContent = await fs.readFile(templateFile, 'utf8');

    const tagMatches = templateContent.match(/{{\s*[\w-]+\s*}}/g);

    if (tagMatches) {
      for (const tag of tagMatches) {
        const componentName = tag.replace(/{{\s*|\s*}}/g, '');
        const componentPath = path.join(
          componentsFolder,
          `${componentName}.html`,
        );

        try {
          const componentContent = await fs.readFile(componentPath, 'utf8');
          templateContent = templateContent.replace(tag, componentContent);
        } catch (err) {
          console.error(`Component ${componentName} not found.`);
        }
      }
    }

    await fs.writeFile(path.join(distFolder, 'index.html'), templateContent);
    console.log('index.html created');
  } catch (err) {
    console.error('Error while building HTML:', err.message);
  }
}

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesFolder, { withFileTypes: true });
    let stylesArray = [];

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const styleContent = await fs.readFile(filePath, 'utf8');
        stylesArray.push(styleContent);
      }
    }

    await fs.writeFile(
      path.join(distFolder, 'style.css'),
      stylesArray.join('\n'),
    );
    console.log('style.css created');
  } catch (err) {
    console.error('Error while merging styles:', err.message);
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('Assets copied');
  } catch (err) {
    console.error('Error while copying assets:', err.message);
  }
}

(async function buildPage() {
  await createDistFolder();
  await buildHTML();
  await mergeStyles();
  await copyAssets(assetsFolder, path.join(distFolder, 'assets'));
})();
