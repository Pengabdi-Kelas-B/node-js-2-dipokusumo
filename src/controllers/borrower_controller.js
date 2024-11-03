const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BorrowerController  {

  static async getAll(req, res) {
    try {
      const items = await DB.Borrower.find().populate({ path: 'borrowings', select: 'bookId borrowDate dueDate returnDate lateFee status' });
      return ResponseHelper.success(res, items, 'sukses mengambil data peminjam');
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Borrower.findById(req.params.id).populate({ path: 'borrowings', select: 'bookId borrowDate dueDate returnDate lateFee status' });
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Borrower.create(req.body);
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

      const items = await DB.Borrower.findByIdAndUpdate(req.params.id, req.body);
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
        if (!req.params.id) {
            return ResponseHelper.error(res, 'ID not provided!', 400);
        }

        const borrowerId = req.params.id;
        const items = await DB.Borrower.findById(borrowerId);

        if (!items) {
            return ResponseHelper.error(res, 'Borrower not found!', 404);
        }

        const activeBorrowing = await DB.Borrowing.findOne({
            borrowerId: borrowerId,
            status: { $in: ['ACTIVE', 'OVERDUE'] }
        });

        if (activeBorrowing) {
            return ResponseHelper.error(res, 'Cannot delete borrower with active or overdue borrowings!', 400);
        }

        await items.deleteOne();

        return ResponseHelper.success(res, items);
    } catch (error) {
        return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BorrowerController