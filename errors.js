class NewtonianError extends Error {}

class NotFoundError extends NewtonianError {
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

class DuplicateError extends NewtonianError {
  constructor(path, value) {
    super(`${path} already contains ${value}`);
    this.name = 'DuplicateError';
    this.path = path;
    this.value = value;
  }
}

class MissingPathError extends NewtonianError {
  constructor(path) {
    super(`Missing required path: ${path}`);
    this.name = 'MissingPathError';
    this.path = path;
  }
}

class MissingSelectorError extends NewtonianError {
  constructor(paths) {
    super(`Missing selector - need one of the following paths: ${paths}`);
    this.name = 'MissingSelectorError';
    this.paths = paths;
  }
}

const AUTH_MESSAGES = {
  NOT_LOGGED_IN: 'Must be logged in',
  NOT_ANONYMOUS: 'Must not be logged in',
  NOT_OWNER: 'Must be resource owner',
};

class AuthError extends NewtonianError {
  constructor(type) {
    super(AUTH_MESSAGES[type]);
    this.name = 'AuthError';
    this.type = type;
  }
}

module.exports = {NotFoundError, DuplicateError, MissingPathError, MissingSelectorError, AuthError};
