const express = require("express")
const BorrowerController = require("../controllers/borrower_controller")

const borrowerRouter = express.Router()

borrowerRouter.get("/borrowers", BorrowerController.getAll)
borrowerRouter.get("/borrower/:id", BorrowerController.getById)
borrowerRouter.post("/borrower", BorrowerController.create)
borrowerRouter.put("/borrower/:id", BorrowerController.update)
borrowerRouter.delete("/borrower/:id", BorrowerController.delete)

module.exports = borrowerRouter