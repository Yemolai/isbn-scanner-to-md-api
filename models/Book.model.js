class Book {
  constructor(obj) {
    this.isbn = obj.isbn;
    this.title = obj.title;
    this.authors = obj.authors;
    this.publishers = obj.publishers;
    this.description = obj.description;
    this.thumbnail = obj.thumbnail;
    this.coverImage = obj.coverImage;
    this.sizeWidth = obj.sizeW;
    this.sizeHeight = obj.sizeH;
    this.sizeDepth = obj.sizeD;
    this.source = obj.source;
  }

  toObject() {
    return {
      isbn: this.isbn,
      title: this.title,
      authors: this.authors,
      publishers: this.publishers,
      description: this.description,
      thumbnail: this.thumbnail,
      coverImage: this.coverImage,
      dimensions: this.dimensions() || undefined,
      source: this.source,
    }
  }

  dimensions() {
    const dimensions = {
      width: this.sizeWidth,
      height: this.sizeHeight,
      depth: this.sizeDepth,
    };

    if (Object.values(dimensions).every(v => v == undefined || v == null)) {
      return null;
    }

    return dimensions;
  }
}

module.exports = { Book };
