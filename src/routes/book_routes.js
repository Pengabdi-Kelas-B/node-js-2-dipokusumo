const express = require("express")
const BookController = require("../controllers/book_controller")

const bookRouter = express.Router()

bookRouter.get("/books", BookController.getAll)
bookRouter.get("/book/:id", BookController.getById)
bookRouter.post("/book", BookController.create)
bookRouter.put("/book/:id", BookController.update)
bookRouter.delete("/book/:id", BookController.delete)
bookRouter.post("/book/upload", BookController.uploadImage)

module.exports = bookRouter