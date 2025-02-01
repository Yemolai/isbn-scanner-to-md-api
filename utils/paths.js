const path = require('path');
const fs = require('fs').promises;

function escapeFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
