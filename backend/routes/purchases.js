const express = require("express");
const PurchaseController = require("../controllers/PurchaseController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

router.get("", PurchaseController.index);

router.post(
  "",
  [
    body("purchaseType").notEmpty(),
    body("transactionType").notEmpty(),
    body("category").notEmpty(),
    body("description").notEmpty(),
    body("date").notEmpty(),
    body("amount").notEmpty(),
  ],
  handleErrorMessage,
  PurchaseController.store
);

router.get("/:id", PurchaseController.show);

router.delete("/:id", PurchaseController.destroy);

router.patch("/:id", PurchaseController.update);

module.exports = router;
