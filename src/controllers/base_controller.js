const ResponseHelper = require("../utils/response");

class BaseController {
    constructor(model) {
      this.model = model;
    }
  
    static async getAll(req, res) {
      try {
        const items = await this.model.find();
        return ResponseHelper.success(res, items);
      } catch (error) {
        return ResponseHelper.error(res, error.message);
      }
    }
  
    static async getById(req, res) {
      try {
        const item = await this.model.findById(req.params.id);
        if (!item) {
          return ResponseHelper.error(res, 'Item not found', 400);
        }
        return ResponseHelper.success(res, item);
      } catch (error) {
        return ResponseHelper.error(res, error.message);
      }
    }
  }
  
  module.exports = BaseController