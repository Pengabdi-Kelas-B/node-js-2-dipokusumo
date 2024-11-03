const DB = require('../models');
const ResponseHelper = require('../utils/response');

class CategoryController  {

  static async getAll(req, res) {
    try {
      const items = await DB.Category.find();
      return ResponseHelper.success(res, items, 'sukses mengambil data kategori');
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Category.findById(req.params.id);
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Category.create(req.body);
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async update(req, res) {
    try {

      if(!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const items = await DB.Category.findByIdAndUpdate(req.params.id, req.body);
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
      
      if(!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const items = await DB.Category.findById(req.params.id);

      if (!items) {
        return ResponseHelper.error(res, 'Category not found!', 404);
      }

      await DB.Book.updateMany(
        { categoryId: items._id },
        { $set: { categoryId: null } }
      );

      await items.deleteOne();

      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = CategoryController