const router = require('express').Router();

const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');
const { ISBNDbAPI } = require('../services/isbndb/ISBNDb.api');
const { OpenLibraryAPI } = require('../services/open-library/OpenLibrary.api');
const { ISBNService } = require('../services/ISBN.service');
const { asyncRoute } = require('../utils/asyncRoute');

const apis = [
  ISBNDbAPI,
  GoogleBooksAPI,
  OpenLibraryAPI,
];

function getISBNServiceInstance() {
  const availableApis = apis.filter(api => api.isAvailable());
  const apiInstances = availableApis.map(Api => new Api());
  return new ISBNService(apiInstances);
}

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
      res.status(400).json({ error: true, reasons: ['invalid ISBN parameter given'] });
      return;
    }

    const isbnService = getISBNServiceInstance();
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

    const isbnService = getISBNServiceInstance();
    const book = await isbnService.getBookByISBN(isbn);
    const { path } = await isbnService.generateMarkdown(book);

    res.status(201).json({
      message: 'Markdown generated successfully',
      filepath: path,
    });
  } catch (error) {
    console.error(new Date().toISOString(), '[/generate-md]', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
