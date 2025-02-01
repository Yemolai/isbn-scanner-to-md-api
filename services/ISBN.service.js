const { Book } = require("../models/Book.model");

class ISBNService {
  constructor (ISBNAPIService) {
    this._api = new ISBNAPIService();
  }

  /**
   * 
   * @param {string} isbnCode
   * @returns {Promise<Book>}
   */
  async getBookByISBN(isbnCode) {
    return this._api.getByISBN(isbnCode);
  }
}

module.exports = { ISBNService };
