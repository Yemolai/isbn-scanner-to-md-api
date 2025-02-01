const request = require('supertest');
const express = require('express');
const booksRouter = require('../routes/books');
const { ISBNService } = require('../services/ISBN.service');

jest.mock('../services/ISBN.service');
jest.mock('../services/google-books/GoogleBooks.api');

const app = express();
app.use(express.json());
app.use('/books', booksRouter);

describe('GET /books/isbn/:isbn', () => {
  it('should return 400 for invalid ISBN', async () => {
    const response = await request(app).get('/books/isbn/invalidisbn');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: true, reasons: ['invalid ISBN parameter given'] });
  });

  it('should return book data for valid ISBN', async () => {
    const mockBook = { toObject: jest.fn().mockReturnValue({ title: 'Test Book' }) };
    ISBNService.mockImplementation(() => {
      return {
        getBookByISBN: jest.fn().mockResolvedValue(mockBook)
      };
    });

    const response = await request(app).get('/books/isbn/1234567890');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { title: 'Test Book' } });
  });
});
