const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PurchaseSchema = new Schema(
  {
    purchaseType: {
      type: String,
      required: true,
      enum: ["Full Form", "Quick Add"],
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["income", "outcome"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
