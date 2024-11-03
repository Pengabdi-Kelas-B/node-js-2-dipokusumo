const express = require("express")
const testRoutes = require("./test_routes")
const bookRouter = require("./book_routes")
const categoryRouter = require("./category_routes")
const authorRouter = require("./author_routes")
const borrowerRouter = require("./borrower_routes")
const borrowingRouter = require("./borrowing_routes")

const routes = express.Router()

routes.use(testRoutes)
routes.use(bookRouter)
routes.use(categoryRouter)
routes.use(authorRouter)
routes.use(borrowerRouter)
routes.use(borrowingRouter)

module.exports = routes