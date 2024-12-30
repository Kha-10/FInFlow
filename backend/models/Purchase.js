const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Boolean,
    required: true,
  },
  unit: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.pricePerUnit) {
          return value !== undefined && value !== null;
        }
        return true;
      },
      message: "Unit is required",
    },
  },
  unitValue: {
    type: Number,
    validate: {
      validator: function (value) {
        if (this.pricePerUnit) {
          return value !== undefined && value !== null;
        }
        return true;
      },
      message: "Unit value is required",
    },
  },
});

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
    items: {
      type: [itemSchema],
      validate: {
        validator: function (value) {
          if (this.purchaseType === "Full Form") {
            return Array.isArray(value) && value.length > 0;
          }
          return true;
        },
        message: "Items are required for Full Form purchases",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
