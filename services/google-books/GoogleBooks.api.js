const { Book } = require("../../models/Book.model");
const { WithLogger } = require("../../utils/WithLogger");
const fetch = require('node-fetch');

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API;

class GoogleBooksAPI extends WithLogger {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} isbnCode 10/13 digits ISBN code or EAN13 code
   * @returns {Book} book data or throw Error
   */
  async getByISBN(isbnCode) {
    const queryParams = new URLSearchParams();
    queryParams.set('q', `isbn:${isbnCode}`);
    queryParams.set('key', API_KEY);

    const url = `${BASE_URL}?${queryParams}`;
    this.__console.log(`Fetching book data from Google Books API for ISBN:${isbnCode}`);
    this.__console.log(`URL: ${url}`);
    return fetch(url, { method: 'get', headers: {} })
      .then(async (response) => {
        const jsonBody = await response.json(); // Fix here
        this.__console.log(`Response status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
          throw new Error('Failed request', { cause: JSON.stringify(jsonBody) });
        }
        return jsonBody;
      })
      .then((jsonBody) => {
        if (!jsonBody || !jsonBody.items || jsonBody.items.length < 1) return null;
        const count = jsonBody.items.length;
        this.__console.log(`Found ${count} record(s) for ISBN:${isbnCode}`);
        this.__console.debug(JSON.stringify(jsonBody, null, 2));

        return this.toBookModel(jsonBody.items[0]);
      });
  }

  /**
   * 
   * @param {Object} item Google Books API item
   * @returns {Book} book model
   */
  toBookModel(item) {
    const volumeInfo = item.volumeInfo;

    return new Book({
      isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || null,
      title: volumeInfo.title,
      authors: (volumeInfo.authors || []).join(', '),
      publishers: (volumeInfo.publisher || ''),
      description: volumeInfo.description || null,
      thumbnail: volumeInfo.imageLinks?.thumbnail || null,
      coverImage: volumeInfo.imageLinks?.thumbnail || null,
      source: 'GoogleBooks'
    });
  }
}

module.exports = { GoogleBooksAPI };
