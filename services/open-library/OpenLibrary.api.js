const { Book } = require("../../models/Book.model");
const { WithLogger } = require("../../utils/WithLogger");
const { OpenLibraryDTO } = require("./OpenLibrary.dto");
const fetch = require('node-fetch');

const BASE_URL = 'https://openlibrary.org/api';

class OpenLibraryAPI extends WithLogger {
  constructor() {
    super();
  }

  /**
   * 
   * @param {string} isbnCode 10/13 digits ISBN code
   * @returns {Book} book data or throw Error
   */
  async getByISBN(isbnCode) {
    const numberOnlyIsbn = isbnCode.replace('-', '');

    const queryParams = new URLSearchParams();
    queryParams.set('bibkeys', `ISBN:${numberOnlyIsbn}`);
    queryParams.set('jscmd', 'details');
    queryParams.set('format', 'json');

    const url = `${BASE_URL}/books?${queryParams}`;
    return fetch(url, { method: 'get', headers: {} })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed request', { cause: response.body });
        }
        return response.json();
      })
      .then((jsonBody) => {
        if (!jsonBody || Object.keys(jsonBody).length < 1) return null;
        const count = Object.keys(jsonBody).length;
        this.__console.log(`Found ${count} record(s) for ISBN:${isbnCode}`);
        this.__console.debug(JSON.stringify(jsonBody, null, 2));

        return OpenLibraryDTO.fromAPIResponse(jsonBody).toBookModel();
      });
  }
}

module.exports = { OpenLibraryAPI };
