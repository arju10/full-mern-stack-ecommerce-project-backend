class APIFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }
  // i means case insensitive
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
}
module.exports = APIFeatures;