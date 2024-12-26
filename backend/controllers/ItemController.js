const Item = require("../models/Item");
const mongoose = require("mongoose");

const ItemController = {
  index: async (req, res) => {
    let limit = 10;
    let page = req.query.page || 1;
    let searchQuery = req.query.search || "";
    const searchCondition = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};
    const sort = req.query.sort || "createdAt";
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
    const sortObject =
      sort === "name" ? { name: sortDirection } : { createdAt: sortDirection };
    let items = await Item.find(searchCondition)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortObject);

    let totalItemCount = await Item.countDocuments();

    let totalPagesCount = Math.ceil(totalItemCount / limit);

    let links = {
      nextPage: totalPagesCount == page ? false : true,
      previousPage: page == 1 ? false : true,
      currentPage: page,
      totalPages : totalPagesCount,
      limit : limit,
      loopableLinks: [],
    };

    for (let index = 0; index < totalPagesCount; index++) {
      let number = index + 1;
      links.loopableLinks.push({ number });
    }

    let response = {
      links,
      data: items,
    };
    return res.json(response);
  },
  store: async (req, res) => {
    const { name } = req.body;
    try {
      const existingItem = await Item.findOne({ name });

      if (existingItem) {
        return res.status(409).json({ msg: "Item name already exists" });
      }

      const item = await Item.create({ name });

      return res.json(item);
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
      let item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({ msg: "Item not found" });
      }
      return res.json(item);
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
      let item = await Item.findByIdAndDelete(id);
      if (!item) {
        return res.status(404).json({ msg: "Item not found" });
      }
      return res.json(item);
    } catch (e) {
      return res.status(500).json({ msg: "Internet server error" });
    }
  },
  update: async (req, res) => {
    console.log(req.body);
    try {
      let id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Not a valid id" });
      }
      let item = await Item.findByIdAndUpdate(id, {
        ...req.body,
      });
      if (!item) {
        return res.status(404).json({ msg: "Item not found" });
      }
      return res.json(item);
    } catch (e) {
      return res.status(500).json({ msg: "Internet server error" });
    }
  },
};

module.exports = ItemController;
