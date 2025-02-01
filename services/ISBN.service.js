const { Book } = require("../models/Book.model");
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');
const { escapeFilename, getMarkdownPath } = require('../utils/paths');

class ISBNService {
  constructor(providers) {
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
    const mergedBook = books.reduce((acc, book) => {
      return {
        isbn: acc.isbn || book.isbn,
        title: acc.title || book.title,
        authors: acc.authors || book.authors,
        publishers: acc.publishers || book.publishers,
        description: acc.description || book.description,
        thumbnail: acc.thumbnail || book.thumbnail,
        coverImage: acc.coverImage || book.coverImage,
        source: acc.source ? `${acc.source}, ${book.source}` : book.source
      };
    }, {});

    return new Book(mergedBook);
  }

  async generateMarkdown(bookData) {
    const templateContent = await fs.readFile('./markdown/template.md.hbs', 'utf8');
    const template = handlebars.compile(templateContent);
    const markdown = template(bookData);

    const outputDir = await getMarkdownPath();
    const filename = `${escapeFilename(bookData.title)}.md`;
    const outputPath = path.join(outputDir, filename);

    try {
      await fs.writeFile(outputPath, markdown, 'utf8');

      return {
        content: markdown,
        path: outputPath
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error writing markdown file');
    }
  }
}

module.exports = { ISBNService };
