class ApiError {
  constructor(status, msg) {
    this.status = status;
    this.message = msg;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static notAuthorised(msg) {
    return new ApiError(401, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg);
  }
}

module.exports = ApiError;
