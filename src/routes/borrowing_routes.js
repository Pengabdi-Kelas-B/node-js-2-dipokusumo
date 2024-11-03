const express = require("express")
const BorrowingController = require("../controllers/borrowing_controller")

const borrowingRouter = express.Router()

borrowingRouter.post("/borrow/book", BorrowingController.borrowBook)
borrowingRouter.get("/borrow/book/list", BorrowingController.getActiveBorrowList)
borrowingRouter.post("/borrow/book/return", BorrowingController.returnBook)

module.exports = borrowingRouter