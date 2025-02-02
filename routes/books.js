const router = require('express').Router();

const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');
const { ISBNDbAPI } = require('../services/isbndb/ISBNDb.api');
const { OpenLibraryAPI } = require('../services/open-library/OpenLibrary.api');
const { ISBNService } = require('../services/ISBN.service');
const { asyncRoute } = require('../utils/asyncRoute');

function loggingPrefix(name) {
  return `${new Date().toISOString()} (/books router - ${name})`;
}

function toHashtag(tag) {
  return `#${tag.replace(' ', '-').replace(/-+/g, '-')}`;
}

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
    console.log(loggingPrefix('/isbn/:isbn'), `Book data retrieved for ISBN:${isbn}`);
    res.json({ data: book.toObject() });
  }),
);

router.post('/generate-md', async (req, res) => {
  try {
    const { isbn, category, subcategory, tags = '' } = req.body;

    const extraData = {
      category,
      subcategory,
      tags: tags
        .split(',')
        .filter(v => v.toString().trim())
        .map(toHashtag)
        .join(' '), // convert tags to hashtags
    };

    if (!isbn) {
      return res.status(400).json({ error: 'ISBN is required' });
    }

    const isbnService = getISBNServiceInstance();
    const book = await isbnService.getBookByISBN(isbn);
    const { path, relativePath } = await isbnService.generateMarkdown({
      ...extraData,
      ...book.toObject(),
    });

    console.log(loggingPrefix('/generate-md'), `Markdown generated for ISBN:${isbn} at ${path}`);

    res.status(201).json({
      message: 'Markdown generated successfully',
      relativePath,
    });
  } catch (error) {
    console.error(loggingPrefix('/generate-md'), error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
