const { OpenLibraryAPI } = require('../services/open-library/OpenLibrary.api');
const { Book } = require('../models/Book.model');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('OpenLibraryAPI', () => {
  let openLibraryAPI;

  beforeEach(() => {
    openLibraryAPI = new OpenLibraryAPI();
  });

  it('should return book data for a valid ISBN', async () => {
    const mockResponse = {
      'ISBN:1234567890': {
        bib_key: 'ISBN:1234567890',
        details: {
          title: 'Test Book',
          authors: [{ name: 'Test Author' }],
          publishers: ['Test Publisher'],
          description: { value: 'Test Description' }
        },
        thumbnail_url: 'http://example.com/thumbnail.jpg'
      }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const book = await openLibraryAPI.getByISBN('1234567890');
    expect(book).toBeInstanceOf(Book);
    expect(book.title).toBe('Test Book');
    expect(book.authors).toBe('Test Author');
  });

  it('should return null for an invalid ISBN', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const book = await openLibraryAPI.getByISBN('invalidisbn');
    expect(book).toBeNull();
  });

  it('should throw an error for a failed request', async () => {
    fetch.mockResolvedValue({
      ok: false,
      body: 'Error'
    });

    await expect(openLibraryAPI.getByISBN('1234567890')).rejects.toThrow('Failed request');
  });
});
