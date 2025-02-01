const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');
const { ISBNService } = require('../services/ISBN.service');
const { asyncRoute } = require('../utils/asyncRoute');

const router = require('express').Router();

router.get('/isbn/:isbn', asyncRoute(
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @returns {Promise}
   */
  async (req, res) => {
    const { isbn } = req.params;
    if (!isbn || /^[0-9]{9}[\-]?[0-9]$/.test(isbn) == false) {
      console.log(JSON.stringify({ isbn }, null, 2));
      res.status(400).json({ error: true, reasons: ['invalid ISBN parameter given'] });
      return;
    }

    const isbnService = new ISBNService(GoogleBooksAPI);
    const book = await isbnService.getBookByISBN(isbn);
    res.json({ data: book.toObject() });
  }),
);

module.exports = router;
