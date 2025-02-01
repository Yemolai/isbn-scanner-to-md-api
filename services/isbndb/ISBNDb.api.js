const { Book } = require("../../models/Book.model");
const { WithLogger } = require("../../utils/WithLogger");
const fetch = require('node-fetch');

const BASE_URL = 'https://api2.isbndb.com';
const API_KEY = process.env.ISBNDB_API_KEY;

class ISBNDbAPI extends WithLogger {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} isbnCode 10/13 digits ISBN code
   * @returns {Book} book data or throw Error
   */
  async getByISBN(isbnCode) {
    if (!API_KEY) {
      throw new Error('ISBNDb API key is not configured. Please set ISBNDB_API_KEY environment variable.');
    }

    if (!isbnCode) {
      throw new Error('ISBN code is required');
    }

    const url = `${BASE_URL}/book/${isbnCode}`;
    
    this.__console.log(`Fetching book data from ISBNDb API for ISBN:${isbnCode}`);
    
    try {
      const response = await fetch(url, {
        method: 'get',
        headers: {
          'Authorization': API_KEY
        }
      });

      const jsonBody = await response.json();
      this.__console.log(`Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorMessage = jsonBody.message || 'Unknown error';
        throw new Error(`ISBNDb API request failed: ${errorMessage}`, {
          cause: {
            status: response.status,
            body: jsonBody
          }
        });
      }

      if (!jsonBody || !jsonBody.book) {
        this.__console.log(`No book data found for ISBN:${isbnCode}`);
        return null;
      }

      this.__console.log(`Found record for ISBN:${isbnCode}`);
      this.__console.debug(JSON.stringify(jsonBody, null, 2));

      return this.toBookModel(jsonBody.book);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error while connecting to ISBNDb API', { cause: error });
      }
      throw error;
    }
  }

  /**
   * 
   * @param {Object} bookData ISBNDb API book data
   * @returns {Book} book model
   */
  toBookModel(bookData) {
    return new Book({
      isbn: bookData.isbn13 || bookData.isbn,
      title: bookData.title,
      authors: bookData.authors?.join(', ') || '',
      publishers: bookData.publisher || '',
      description: bookData.synopsis || bookData.overview || null,
      thumbnail: bookData.image || null,
      coverImage: bookData.image || null,
      source: 'ISBNDb'
    });
  }
}

ISBNDbAPI.isAvailable = () => Boolean(API_KEY);

module.exports = { ISBNDbAPI };
