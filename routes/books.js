const router = require('express').Router();
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');
const { OpenLibraryAPI } = require('../services/open-library/OpenLibrary.api');
const { ISBNService } = require('../services/ISBN.service');
const { asyncRoute } = require('../utils/asyncRoute');


router.get('/isbn/:isbn', asyncRoute(
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @returns {Promise}
   */
  async (req, res) => {
    const { isbn } = req.params;
    if (!isbn || /^([0-9]{9}[\-]?[0-9])|([0-9]{13})$/.test(isbn) == false) {
      console.log(JSON.stringify({ isbn }, null, 2));
      res.status(400).json({ error: true, reasons: ['invalid ISBN parameter given'] });
      return;
    }

    const isbnService = new ISBNService([new GoogleBooksAPI(), new OpenLibraryAPI()]);
    const book = await isbnService.getBookByISBN(isbn);
    res.json({ data: book.toObject() });
  }),
);

router.post('/generate-md', async (req, res) => {
  try {
    const { isbn } = req.body;

    if (!isbn) {
      return res.status(400).json({ error: 'ISBN is required' });
    }

    const isbnService = new ISBNService([new GoogleBooksAPI(), new OpenLibraryAPI()]);
    const book = await isbnService.getBookByISBN(isbn);
    const { path } = await isbnService.generateMarkdown(book);

    res.status(201).json({
      message: 'Markdown generated successfully',
      filepath: path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
