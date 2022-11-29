class ApiException extends Error {
  constructor(message, innerException) {
    super(error);
    this.message = message;
    this.innerException - innerException;
    console.error(message);
  }
}

module.exports = ApiException;
