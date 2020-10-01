class ApplicationError extends Error {}

class NotFoundError extends ApplicationError {
  constructor(resource, path, query) {
    const message = query
      ? `No ${resource} found matching ${path}: ${query}`
      : `No ${resource} found`;
    super(message);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.path = path;
    this.query = query;
  }
}

class DuplicateError extends ApplicationError {
  constructor(path, value) {
    super(`${path} already contains ${value}`);
    this.name = 'DuplicateError';
    this.path = path;
    this.value = value;
  }
}

module.exports = {NotFoundError, DuplicateError};
