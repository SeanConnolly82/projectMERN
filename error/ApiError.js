class ApiError {
  constructor(status, msg) {
    this.status = status;
    this.message = msg;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }
}

module.exports = ApiError;
