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

module.exports = {
  escapeFilename,
  getMarkdownPath
};
