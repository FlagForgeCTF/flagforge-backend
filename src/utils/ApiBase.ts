// Base class for API responses (both success & error)

class ApiBase {
    statusCode: number;
    message: any;
    data: any;
    success: boolean;
  
    constructor(statusCode: number, message: any, data: any, success: boolean) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = success;
    }
  }
  
  export class ApiResponse extends ApiBase {
    constructor(statusCode: number, message: any, data: any = null) {
      super(statusCode, message, data, true);
    }
  }
  
  export class ApiError extends ApiBase {
    constructor(
      statusCode: number = 500,
      message: any = "Internal Server Error",
      data: any = null
    ) {
      super(statusCode, message, data, false);
    }
  }
  
  