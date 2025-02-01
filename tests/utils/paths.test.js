const path = require('path');
const { escapeFilename, getMarkdownPath } = require('../../utils/paths');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('escapeFilename', () => {
  test('converts spaces to hyphens', () => {
    expect(escapeFilename('Hello World')).toBe('hello-world');
  });

  test('removes special characters', () => {
    expect(escapeFilename('Hello@#$%^&* World!')).toBe('hello-world');
  });

  test('removes consecutive hyphens', () => {
    expect(escapeFilename('Hello---World')).toBe('hello-world');
  });

  test('removes leading and trailing hyphens', () => {
    expect(escapeFilename('-Hello World-')).toBe('hello-world');
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
