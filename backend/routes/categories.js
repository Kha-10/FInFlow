const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

router.get("", CategoryController.index);

router.post(
  "",
  [body("name").notEmpty()],
  handleErrorMessage,
  CategoryController.store
);

router.get("/:id", CategoryController.show);

router.delete("/:id", CategoryController.destroy);

router.patch("/:id", CategoryController.update);

module.exports = router;