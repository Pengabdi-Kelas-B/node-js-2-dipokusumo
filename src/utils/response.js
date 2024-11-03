class ResponseHelper {
    static success(res, data, message = 'Success', code = 200) {
      return res.status(code).json({
        success: true,
        message,
        data
      });
    }
  
    static error(res, message = 'Internal Server Error', code = 500) {
      return res.status(code).json({
        success: false,
        message
      });
    }
  }

module.exports = ResponseHelper