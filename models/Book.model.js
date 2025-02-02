class Book {
  constructor(obj) {
    this.isbn = obj.isbn;
    this.title = obj.title;
    this.authors = obj.authors;
    this.publishers = obj.publishers;
    this.description = obj.description;
    this.thumbnail = obj.thumbnail;
    this.coverImage = obj.coverImage;
    this.width = obj.width;
    this.height = obj.height;
    this.depth = obj.depth;
    this.source = obj.source;
    this.weight = obj.weight;
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
      width: this.width ? { value: this.width.toFixed(1), unit: 'cm' } : undefined,
      height: this.height ? { value: this.height.toFixed(1), unit: 'cm' } : undefined,
      depth: this.depth ? { value: this.depth.toFixed(1), unit: 'cm' } : undefined,
      weight: this.weight ? { value: this.weight.toFixed(3), unit: 'kg' } : undefined,
    };

    if (Object.values(dimensions).every(v => v == undefined || v == null)) {
      return null;
    }

    return dimensions;
  }
}

module.exports = { Book };
