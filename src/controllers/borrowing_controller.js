const mongoose = require('mongoose');
const DB = require('../models');
const ResponseHelper = require("../utils/response");

class BorrowingController {
    static async borrowBook(req, res) {
        try {
            const { bookId, borrowerId, dueDate } = req.body;

            const bookStock = await DB.BookStock.findOne({ bookId });
            if (!bookStock || bookStock.availableQuantity < 1) {
                return ResponseHelper.error(res, 'Book is not available for borrowing', 400);
            }

            bookStock.availableQuantity -= 1;
            bookStock.borrowedQuantity += 1;
            await bookStock.save();

            const borrowEntry = await DB.Borrowing.create({
                bookId,
                borrowerId,
                borrowDate: new Date(),
                dueDate,
                status: 'ACTIVE'
            });

            await DB.StockLog.create({
                bookId,
                bookStockId: bookStock._id,
                action: 'BORROW',
                quantity: 1,
                reason: 'Book borrowed by borrower',
                referenceId: borrowEntry._id
            });

            await DB.Borrower.findByIdAndUpdate(
                borrowerId,
                { $push: { borrowHistory: borrowEntry._id } },
                { new: true, useFindAndModify: false }
            );

            return ResponseHelper.success(res, borrowEntry);
        } catch (error) {
            return ResponseHelper.error(res, error.message, 500);
        }
    }

    static async getActiveBorrowList(req, res) {
        try {
            const activeBorrows = await DB.Borrowing.find({ status: ['ACTIVE', 'OVERDUE'] })
                .populate('bookId', 'title description')
                .populate('borrowerId', 'name');

            return ResponseHelper.success(res, activeBorrows);
        } catch (error) {
            return ResponseHelper.error(res, error.message, 500);
        }
    }

    static async returnBook(req, res) {
        try {
            const { borrowingId, returnDate } = req.body;

            const borrowing = await DB.Borrowing.findById(borrowingId);
            if (!borrowing || (borrowing.status !== 'ACTIVE' && borrowing.status !== 'OVERDUE')) {
                return ResponseHelper.error(res, 'Borrowing entry not found or already returned', 404);
            }

            const bookStock = await DB.BookStock.findOne({ bookId: borrowing.bookId });
            if (!bookStock) {
                return ResponseHelper.error(res, 'Book stock entry not found', 404);
            }

            borrowing.status = 'RETURNED';
            borrowing.returnDate = returnDate;

            await borrowing.save();

            bookStock.availableQuantity += 1;
            bookStock.borrowedQuantity -= 1;
            await bookStock.save();

            await DB.StockLog.create({
                bookId: borrowing.bookId,
                bookStockId: bookStock._id,
                action: 'RETURN',
                quantity: 1,
                reason: 'Book returned by borrower',
                referenceId: borrowing._id
            });

            return ResponseHelper.success(res, borrowing);
        } catch (error) {
            return ResponseHelper.error(res, error.message, 500);
        }
    }    
}

module.exports = BorrowingController;