const { GoogleBooksAPI } = require('../services/google-books/GoogleBooks.api');
const { Book } = require('../models/Book.model');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('GoogleBooksAPI', () => {
  let googleBooksAPI;

  beforeEach(() => {
    googleBooksAPI = new GoogleBooksAPI();
  });

  it('should return book data for a valid ISBN', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: 'Test Book',
            authors: ['Test Author'],
            publisher: 'Test Publisher',
            description: 'Test Description',
            industryIdentifiers: [{ type: 'ISBN_13', identifier: '1234567890123' }],
            imageLinks: { thumbnail: 'http://example.com/thumbnail.jpg' }
          }
        }
      ]
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const book = await googleBooksAPI.getByISBN('1234567890123');
    expect(book).toBeInstanceOf(Book);
    expect(book.title).toBe('Test Book');
    expect(book.authors).toBe('Test Author');
  });

  it('should return null for an invalid ISBN', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] })
    });

    const book = await googleBooksAPI.getByISBN('invalidisbn');
    expect(book).toBeNull();
  });

  it('should throw an error for a failed request', async () => {
    fetch.mockResolvedValue({
      ok: false,
      body: 'Error'
    });

    await expect(googleBooksAPI.getByISBN('1234567890123')).rejects.toThrow('Failed request');
  });
});
