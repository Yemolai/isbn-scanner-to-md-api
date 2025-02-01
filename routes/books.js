const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');
const { OpenLibraryAPI } = require('../services/open-library/OpenLibrary.api');
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

router.post('/generate-md', (req, res) => {
  const bookData = req.body;
  const templatePath = path.join(__dirname, '../markdown/template.md.hbs');
  const outputPath = path.join(__dirname, '../markdown/books', `${bookData.isbn}.md`);

  fs.readFile(templatePath, 'utf8', (err, templateContent) => {
    if (err) return res.status(500).send('Error reading template');
    const template = handlebars.compile(templateContent);
    const markdown = template(bookData);

    fs.writeFile(outputPath, markdown, (err) => {
      if (err) return res.status(500).send('Error writing markdown file');
      res.send('Markdown file generated successfully');
    });
  });
});


module.exports = router;
