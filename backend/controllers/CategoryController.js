const Category = require("../models/Category");
const mongoose = require("mongoose");

const CategoryController = {
  index: async (req, res) => {
    let limit = 10;
    let page = req.query.page || 1;
    let searchQuery = req.query.search || "";
    const userId = req.user._id;

    const searchCondition = {
      userId,
    };
    if (searchQuery) {
      searchCondition.name = { $regex: searchQuery, $options: "i" };
    }
    const sort = req.query.sort || "createdAt";
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
    const sortObject =
      sort === "name" ? { name: sortDirection } : { createdAt: sortDirection };
    let categories = await Category.find(searchCondition)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortObject);

    let totalCategoryCount = await Category.countDocuments({userId});

    let totalPagesCount = Math.ceil(totalCategoryCount / limit);

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
      data: categories,
    };
    return res.json(response);
  },
  store: async (req, res) => {
    const { name } = req.body;
    try {
      const userId = req.user._id;
      const existingCategory = await Category.findOne({ name, userId });

      if (existingCategory) {
        return res.status(409).json({ msg: "Category name already exists" });
      }

      const category = await Category.create({ name, userId });

      return res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ msg: "Internet Server error" });
    }
  },
  show: async (req, res) => {
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not a valid id" });
      }
      let category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      return res.json(category);
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
      let category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      return res.json(category);
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
      let category = await Category.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }
      return res.json(category);
    } catch (e) {
      return res.status(500).json({ msg: "Internet server error" });
    }
  },
};

module.exports = CategoryController;
