export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(data, message = 'Success', statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  static created(data, message = 'Created successfully') {
    return new ApiResponse(201, data, message);
  }
}
