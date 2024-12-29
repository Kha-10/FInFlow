const Purchase = require("../models/Purchase");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const PurchaseController = {
  index: async (req, res) => {
    let limit = 6;
    let page = req.query.page || 1;
    let searchQuery = req.query.search || "";
    const searchCondition = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};
    const sort = req.query.sort || "createdAt";
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
    const sortObject =
      sort === "name" ? { name: sortDirection } : { createdAt: sortDirection };
    let purchases = await Purchase.find(searchCondition)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortObject);

    let totalPurchaseCount = await Purchase.countDocuments();

    let totalPagesCount = Math.ceil(totalPurchaseCount / limit);

    let categories = await Category.find(searchCondition);

    let links = {
      nextPage: totalPagesCount == page ? false : true,
      previousPage: page == 1 ? false : true,
      currentPage: page,
      totalPages: totalPagesCount,
      limit: limit,
      loopableLinks: [],
    };

    for (let index = 0; index < totalPagesCount; index++) {
      let number = index + 1;
      links.loopableLinks.push({ number });
    }

    let response = {
      links,
      data: { purchases: purchases, categories: categories },
    };
    return res.json(response);
  },
  store: async (req, res) => {
    const {
      purchaseType,
      transactionType,
      category,
      description,
      date,
      amount,
    } = req.body;
    try {
      const purchase = await Purchase.create({
        purchaseType,
        transactionType,
        category,
        description,
        date,
        amount,
      });

      const populatedPurchase = await Purchase.findById(purchase._id).populate(
        "category"
      );

      return res.json(populatedPurchase);
    } catch (error) {
      console.error("Error creating purchase:", error);
      return res.status(500).json({ msg: "Internet Server error" });
    }
  },
  show: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not a valid id" });
      }
      let purchase = await Purchase.findById(id);
      if (!purchase) {
        return res.status(404).json({ msg: "Purchase not found" });
      }
      return res.json(purchase);
    } catch (e) {
      return res.status(500).json({ msg: "Internet server error" });
    }
  },
  destroy: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not a valid id" });
      }
      let purchase = await Purchase.findByIdAndDelete(id);
      if (!purchase) {
        return res.status(404).json({ msg: "Purchase not found" });
      }
      return res.json(purchase);
    } catch (e) {
      return res.status(500).json({ msg: "Internet server error" });
    }
  },
  update: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not a valid id" });
      }
      let purchase = await Purchase.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { new: true }
      ).populate("category");
      if (!purchase) {
        return res.status(404).json({ msg: "Purchase not found" });
      }
      return res.json(purchase);
    } catch (e) {
      return res.status(500).json({ msg: "Internet server error" });
    }
  },
};

module.exports = PurchaseController;
