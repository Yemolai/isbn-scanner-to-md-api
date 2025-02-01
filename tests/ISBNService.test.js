const { ISBNService } = require('../services/ISBN.service');
const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');

jest.mock('../services/google-books/GoogleBooks.api');

describe('ISBNService', () => {
  let isbnService;

  beforeEach(() => {
    isbnService = new ISBNService(GoogleBooksAPI);
  });

  it('should return book data for valid ISBN', async () => {
    const mockBook = { title: 'Test Book' };
    GoogleBooksAPI.prototype.getBookByISBN = jest.fn().mockResolvedValue(mockBook);

    const book = await isbnService.getBookByISBN('1234567890');
    expect(book).toEqual(mockBook);
  });

  it('should throw an error for invalid ISBN', async () => {
    GoogleBooksAPI.prototype.getBookByISBN = jest.fn().mockResolvedValue(null);

    await expect(isbnService.getBookByISBN('invalidisbn')).rejects.toThrow('Book not found');
  });
});
