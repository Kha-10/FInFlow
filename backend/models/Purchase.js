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
      validate: {
        validator: function (value) {
          if (this.purchaseType === "Quick Add") {
            return value !== undefined && value !== null;
          }
          return true;
        },
        message: "Amount is required for Quick Add purchases",
      },
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        pricePerUnit: { type: Boolean, required: true },
        unitValue: { type: Number },
        unit: { type: String },
      },
    ],
    total: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
