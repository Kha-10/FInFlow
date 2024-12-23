const express = require("express");
const ItemController = require("../controllers/ItemController");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

router.get("", ItemController.index);

router.post(
  "",
  [body("name").notEmpty()],
  handleErrorMessage,
  ItemController.store
);

router.get("/:id", ItemController.show);

router.delete("/:id", ItemController.destroy);

router.patch("/:id", ItemController.update);

module.exports = router;