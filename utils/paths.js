const path = require('path');
const fs = require('fs').promises;

function escapeFilename(title, { 
  replacer = '-', 
  lowercase = true, 
  maxLength = 100 
} = {}) {
  const _title = lowercase ? title.toLowerCase() : title;
  return _title
    // preserve á à ã â é ê í ó ô õ ú ç ü ñ and their uppercase variants
    .replace(/[^a-zA-ZáàãâéêíóôõúçüñÁÀÃÂÉÊÍÓÔÕÚÇÜÑ'0-9\n\r\-]+/g, replacer)
    .replace(new RegExp(`${replacer}+`, 'g'), replacer)
    .replace(new RegExp(`^${replacer}|${replacer}$`, 'g'), '')
    .substring(0, maxLength);
}

async function getMarkdownPath() {
  const configuredPath = process.env.MARKDOWN_OUTPUT_PATH;

  // Default path inside repository
  const targetPath = configuredPath || (path.join(process.cwd(), 'markdown', 'books'));
  await fs.mkdir(targetPath, { recursive: true });
  return targetPath;
}

async function getCoverImagesPath() {
  const customPath = process.env.COVER_IMAGES_PATH;
  if (customPath) {
    await fs.mkdir(customPath, { recursive: true });
    return customPath;
  }
  const defaultPath = path.join(process.cwd(), 'cover-images');
  await fs.mkdir(defaultPath, { recursive: true });
  return defaultPath;
}

function formatImagePath(isbn, title, imageUrl) {
  if (!imageUrl) return null;
  const extension = path.extname(new URL(imageUrl).pathname) || '.jpg';
  const filename = `${isbn}-${escapeFilename(title)}${extension}`;
  return filename;
}

module.exports = {
  escapeFilename,
  getMarkdownPath,
  getCoverImagesPath,
  formatImagePath
};
