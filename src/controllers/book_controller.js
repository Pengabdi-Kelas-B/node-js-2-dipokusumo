const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BookController  {

  static async getAll(req, res) {
    try {
      const items = await DB.Book.find().populate('categoryId', 'name description').populate('authorId', 'name bio');

      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Book.findById(req.params.id).populate('categoryId', 'name description').populate('authorId', 'name bio');
      
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
        const items = await DB.Book.create(req.body);
        const authorId = req.body.authorId;

        await DB.Author.findByIdAndUpdate(
            authorId,
            { $push: { books: items._id } },
            { new: true, useFindAndModify: false }
        );

        const bookStock = new DB.BookStock({
            bookId: items._id,
            totalQuantity: req.body.totalQuantity || 0,
            availableQuantity: req.body.totalQuantity || 0,
            borrowedQuantity: 0
        });

        await bookStock.save();

        await DB.StockLog.create([{
            bookId: items._id,
            bookStockId: bookStock._id,
            action: 'ADD',
            quantity: req.body.totalQuantity || 0,
            reason: 'Initial stock added for the new book',
            referenceId: items._id
        }]);

        return ResponseHelper.success(res, items);
    } catch (error) {
        return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async update(req, res) {
    try {
        if (!req.params.id) {
            return ResponseHelper.error(res, 'ID not provided!', 400);
        }

        const existingBook = await DB.Book.findById(req.params.id);

        if (!existingBook) {
            return ResponseHelper.error(res, 'Book not found!', 404);
        }

        const previousAuthorId = existingBook.authorId;
        const newAuthorId = req.body.authorId;

        const items = await DB.Book.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });

        if (newAuthorId && (!previousAuthorId || previousAuthorId.toString() !== newAuthorId.toString())) {
            await DB.Author.findByIdAndUpdate(
                previousAuthorId,
                { $pull: { books: items._id } },
                { new: true, useFindAndModify: false }
            );

            await DB.Author.findByIdAndUpdate(
                newAuthorId,
                { $push: { books: items._id } },
                { new: true, useFindAndModify: false }
            );
        }

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

        const items = await DB.Book.findById(req.params.id);
        if (!items) {
            return ResponseHelper.error(res, 'Book not found!', 404);
        }

        const activeBorrowing = await DB.Borrowing.findOne({
            bookId: items._id,
            status: { $in: ['ACTIVE', 'OVERDUE'] }
        });

        if (activeBorrowing) {
            return ResponseHelper.error(res, 'Cannot delete book with active or overdue borrowings!', 400);
        }

        await DB.Author.findByIdAndUpdate(
            items.authorId,
            { $pull: { books: items._id } },
            { new: true, useFindAndModify: false }
        );

        const bookStock = await DB.BookStock.findOneAndDelete({ bookId: items._id });
        if (bookStock) {
            await DB.StockLog.create([{
                bookId: items._id,
                bookStockId: bookStock._id,
                action: 'REMOVE',
                quantity: bookStock.totalQuantity,
                reason: 'Book removed from stock',
                referenceId: items._id
            }]);
        }

        await items.deleteOne();

        return ResponseHelper.success(res, items);
    } catch (error) {
        return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async uploadImage(req, res) {
    try {
      
      if(!req.body.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Book.findById(req.body.id);

      item.coverUrl = req.body.coverUrl

      await item.save()

      return ResponseHelper.success(res, item);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BookController