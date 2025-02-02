const { Book } = require("../models/Book.model");
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const handlebars = require('handlebars');
const { escapeFilename, getMarkdownPath, getCoverImagesPath, formatImagePath } = require('../utils/paths');
const { WithLogger } = require("../utils/WithLogger");

class ISBNService extends WithLogger {
  constructor(providers) {
    super();
    this.providers = providers;
  }

  /**
   * 
   * @param {string} isbnCode
   * @returns {Promise<Book>}
   */
  async getBookByISBN(isbnCode) {
    const results = await Promise.allSettled(
      this.providers.map(provider => provider.getByISBN(isbnCode))
    );

    const books = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);

    if (books.length === 0) {
      throw new Error(`No data found for ISBN:${isbnCode}`);
    }

    return this.mergeBookData(books);
  }

  /**
   * 
   * @param {Book[]} books array of book data from different providers
   * @returns {Book} merged book data
   */
  mergeBookData(books) {
    this.__console.debug('Merging book data:', books);
    const mergedBook = books.reduce((acc, book) => {
      return {
        isbn: acc.isbn || book.isbn,
        title: acc.title || book.title,
        authors: acc.authors || book.authors,
        publishers: acc.publishers || book.publishers,
        description: acc.description || book.description,
        thumbnail: acc.thumbnail || book.thumbnail,
        coverImage: acc.coverImage || book.coverImage,
        publicationDate: acc.publicationDate || book.publicationDate,
        width: acc.width || book.width,
        height: acc.height || book.height,
        depth: acc.depth || book.depth,
        weight: acc.weight || book.weight,
        source: acc.source ? `${acc.source}, ${book.source}` : book.source
      };
    }, {});

    return new Book(mergedBook);
  }

  async downloadCoverImage(book) {
    if (!book.coverImage) return null;

    const imagesPath = await getCoverImagesPath();
    const filename = formatImagePath(book.isbn, book.title, book.coverImage);
    if (!filename) return null;

    const outputPath = path.join(imagesPath, filename);

    try {
      const response = await fetch(book.coverImage);
      if (!response.ok) throw new Error('Failed to fetch image');

      const buffer = await response.buffer();
      await fs.writeFile(outputPath, buffer);

      return path.relative(await getMarkdownPath(), outputPath);
    } catch (error) {
      this.__console.error('Error downloading cover image:', error);
      return null;
    }
  }

  async generateMarkdown(bookData) {
    const { category, subcategory } = bookData;
    const localCoverPath = await this.downloadCoverImage(bookData);
    const templateData = {
      ...bookData,
      localCoverPath
    };

    const templateContent = await fs.readFile('./markdown/template.md.hbs', 'utf8');
    const template = handlebars.compile(templateContent);
    const markdown = template(templateData);

    const outputDir = await getMarkdownPath(category, subcategory);
    const filename = `${escapeFilename(bookData.title, { replacer: ' ', lowercase: false })}.md`;
    const outputPath = path.join(outputDir, filename);

    try {
      await fs.writeFile(outputPath, markdown, 'utf8');

      return {
        content: markdown,
        path: outputPath,
        relativePath: path.relative(await getMarkdownPath(), outputPath)
      };
    } catch (error) {
      this.__console.error(error);
      throw new Error('Error writing markdown file');
    }
  }
}

module.exports = { ISBNService };
