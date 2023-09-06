class HttpError extends Error {
  constructor(statusCode, message, data) {
    if (!data) {
      if (!(typeof message === "string" || message instanceof String)) {
        data = message;
        message = data[Object.keys(data)[0]]?.[0];
      }
    }
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = {
  HttpError,
};
