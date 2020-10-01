class ApplicationError extends Error {}

class NotFoundError extends ApplicationError {
  constructor(resource, query) {
    const message = query ? `No ${resource} found matching ${query}` : `No ${resource} found`;
    super(message);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.query = query;
  }
}

module.exports = {NotFoundError};
