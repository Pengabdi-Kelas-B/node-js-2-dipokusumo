const express = require("express")
const CategoryController = require("../controllers/category_controller")

const categoryRouter = express.Router()

categoryRouter.get("/categories", CategoryController.getAll)
categoryRouter.get("/category/:id", CategoryController.getById)
categoryRouter.post("/category", CategoryController.create)
categoryRouter.put("/category/:id", CategoryController.update)
categoryRouter.delete("/category/:id", CategoryController.delete)

module.exports = categoryRouter