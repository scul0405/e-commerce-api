class ApiFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const queryObjectClone = { ...this.queryObject };
    const excludedFields = ['limit', 'sort', 'fields', 'page'];
    excludedFields.forEach((field) => delete queryObjectClone[field]);
    let queryString = JSON.stringify(queryObjectClone);
    //  add $ before special query
    const regex = /\b(gt|gte|lt|lte|in)\b/g;
    queryString = queryString.replace(regex, (match) => `$${match}`);
    console.log(JSON.parse(queryString));
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  fields() {
    if (this.queryObject.fields) {
      const queryField = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(queryField);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-quantitySold'); // sort by best seller
    }
    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
