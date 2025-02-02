const { Book } = require("../../models/Book.model");
const { convertLength, convertWeight } = require("../../utils/units");

class ISBNDbDTO {
  constructor(rawObject) {
    this._rawObject = rawObject;
  }

  toBookModel() {
    const dims = this._rawObject.dimensions_structured;
    const dimensions = dims ? {
      width: convertLength(dims.width?.value, dims.width?.unit),
      height: convertLength(dims.height?.value, dims.height?.unit),
      depth: convertLength(dims.length?.value, dims.length?.unit),
      weight: convertWeight(dims.weight?.value, dims.weight?.unit),
    } : {};

    return new Book({
      isbn: this._rawObject.isbn13 || this._rawObject.isbn,
      title: this._rawObject.title,
      authors: this._rawObject.authors?.join(', ') || '',
      publishers: this._rawObject.publisher || '',
      description: this._rawObject.synopsis || this._rawObject.overview || null,
      thumbnail: this._rawObject.image || null,
      coverImage: this._rawObject.image || null,
      publicationDate: this._rawObject.publication_date,
      source: ISBNDbDTO.source,
      ...dimensions,
    });
  }
}

ISBNDbDTO.fromAPIResponse = (apiResponse) => {
  return new ISBNDbDTO(apiResponse.book);
};

ISBNDbDTO.source = 'ISBNDb';

module.exports = { ISBNDbDTO };
