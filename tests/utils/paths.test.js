const path = require('path');
const { escapeFilename, getMarkdownPath, getCoverImagesPath, formatImagePath } = require('../../utils/paths');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('escapeFilename', () => {
  test('uses default options when none provided', () => {
    expect(escapeFilename('Hello World')).toBe('hello-world');
  });

  test('respects custom replacer', () => {
    expect(escapeFilename('Hello World', { replacer: '_' })).toBe('hello_world');
  });

  test('respects lowercase option', () => {
    expect(escapeFilename('Hello World', { lowercase: false })).toBe('Hello-World');
  });

  test('respects maxLength option', () => {
    expect(escapeFilename('Hello World', { maxLength: 7 })).toBe('hello-w');
  });

  test('preserves Portuguese special characters', () => {
    const text = 'São Paulo não é Belém';
    expect(escapeFilename(text, { lowercase: false })).toBe('São-Paulo-não-é-Belém');
  });

  test('handles multiple consecutive special characters', () => {
    expect(escapeFilename('Hello!!!World???')).toBe('hello-world');
  });
});

describe('getMarkdownPath', () => {
  const originalCwd = process.cwd;
  const mockCwd = '/mock/cwd';

  beforeEach(() => {
    process.cwd = jest.fn().mockReturnValue(mockCwd);
  });

  afterEach(() => {
    process.cwd = originalCwd;
    delete process.env.MARKDOWN_OUTPUT_PATH;
  });

  test('returns configured path when env variable is set', async () => {
    process.env.MARKDOWN_OUTPUT_PATH = '/custom/path';
    const result = await getMarkdownPath();
    expect(result).toBe('/custom/path');
  });

  test('returns default path when no env variable is set', async () => {
    const result = await getMarkdownPath();
    expect(result).toBe(path.join(mockCwd, 'markdown', 'books'));
  });
});

describe('getCoverImagesPath', () => {
  const originalCwd = process.cwd;
  const mockCwd = '/mock/cwd';

  beforeEach(() => {
    process.cwd = jest.fn().mockReturnValue(mockCwd);
  });

  afterEach(() => {
    process.cwd = originalCwd;
    delete process.env.COVER_IMAGES_PATH;
  });

  test('returns configured path when env variable is set', async () => {
    process.env.COVER_IMAGES_PATH = '/custom/covers';
    const result = await getCoverImagesPath();
    expect(result).toBe('/custom/covers');
  });

  test('returns default path when no env variable is set', async () => {
    const result = await getCoverImagesPath();
    expect(result).toBe(path.join(mockCwd, 'cover-images'));
  });
});

describe('formatImagePath', () => {
  test('generates correct filename with ISBN and title', () => {
    const result = formatImagePath('1234567890', 'Test Book', 'http://example.com/image.jpg');
    expect(result).toBe('1234567890-test-book.jpg');
  });

  test('handles URLs without file extension', () => {
    const result = formatImagePath('1234567890', 'Test Book', 'http://example.com/image');
    expect(result).toBe('1234567890-test-book.jpg');
  });

  test('preserves original file extension when present', () => {
    const result = formatImagePath('1234567890', 'Test Book', 'http://example.com/image.png');
    expect(result).toBe('1234567890-test-book.png');
  });

  test('returns null for invalid or missing image URL', () => {
    expect(formatImagePath('1234567890', 'Test Book', null)).toBeNull();
    expect(formatImagePath('1234567890', 'Test Book', '')).toBeNull();
  });

  test('handles special characters in title', () => {
    const result = formatImagePath('1234567890', 'São Paulo', 'http://example.com/image.jpg');
    expect(result).toBe('1234567890-são-paulo.jpg');
  });
});
