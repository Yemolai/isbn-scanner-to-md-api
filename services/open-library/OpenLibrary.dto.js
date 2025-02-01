const { Book } = require("../../models/Book.model");
const { WithLogger } = require("../../utils/WithLogger");

class OpenLibraryDTO extends WithLogger {
  source = 'OpenLibrary';

  constructor(dataObject) {
    super();
    this._rawObject = dataObject;
  }

  toBookModel() {
    const obj = this._rawObject;

    try {
      return new Book({
        isbn: obj.bib_key.split(':')[1],
        title: obj.details.title,
        authors: this.authorsNames().join(', '),
        publishers: (obj.details.publishers || []).join(', '),
        description: obj.details?.description?.value || null,
        thumbnail: obj.thumbnail_url,
        coverImage: obj.thumbnail_url,
        source: this.source
      });
    } catch(error) {
      this.__console.error(
        `Failed to instantiate Book from raw model:\n${obj}\nError: ${error}`
      );
      throw error;
    }
  }

  /**
   * 
   * @returns {Array<string>} authors[N].name
   */
  authorsNames() {
    const { details: { authors } } = this._rawObject;
    if (!authors) return [];

    if (Array.isArray(authors)) {
      return authors.map((author) => author.name);
    }

    this.__console.error('Unsupported signature of authors property', this._rawObject.authors);

    return [];
  }
}

OpenLibraryDTO.fromAPIResponse = (apiResponse) => {
  const keys = Object.keys(apiResponse);

  if (keys.length < 1) {
    throw new Error('Empty response');
  }

  return new OpenLibraryDTO(apiResponse[keys[0]]);
}

module.exports = { OpenLibraryDTO };
