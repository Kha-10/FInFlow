const Purchase = require("../models/Purchase");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const moment = require("moment");
const Item = require("../models/Item");

const PurchaseController = {
  //   index: async (req, res) => {
  //     let limit = 6;
  //     let page = req.query.page || 1;
  //     let searchQuery = req.query.search || "";
  //     const searchCondition = searchQuery
  //       ? { name: { $regex: searchQuery, $options: "i" } }
  //       : {};
  //     const sort = req.query.sort || "createdAt";
  //     const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
  //     const sortObject =
  //       sort === "name" ? { name: sortDirection } : { createdAt: sortDirection };

  //     let startDate, endDate;
  //     if (req.query.dateRange) {
  //       const [start, end] = req.query.dateRange.split(",");
  //       startDate = new Date(start.trim());
  //       endDate = new Date(end.trim());
  //     }

  //     let category = req.query.dateRange;

  //     let transactionType = req.query.type;

  //     let purchases = await Purchase.find(searchCondition)
  //       .populate("category")
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  //       .sort(sortObject);

  //     let totalPurchaseCount = await Purchase.countDocuments();

  //     let totalPagesCount = Math.ceil(totalPurchaseCount / limit);

  //     let categories = await Category.find(searchCondition);

  //     let links = {
  //       nextPage: totalPagesCount == page ? false : true,
  //       previousPage: page == 1 ? false : true,
  //       currentPage: page,
  //       totalPages: totalPagesCount,
  //       limit: limit,
  //       loopableLinks: [],
  //     };
  //     for (let index = 0; index < totalPagesCount; index++) {
  //       let number = index + 1;
  //       links.loopableLinks.push({ number });
  //     }

  //     let response = {
  //       links,
  //       data: { purchases: purchases, categories: categories },
  //     };
  //     return res.json(response);
  //   },
  index: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 6;
      const page = parseInt(req.query.page, 10) || 1;
      const searchQuery = req.query.search || "";
      const sort = req.query.sort || "createdAt";
      const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
      const dateRange = req.query.dateRange || "";
      const category = req.query.category || "";
      const transactionType = req.query.type || "";

      const userId = req.user._id;

      const searchCondition = {
        userId,
      };

      // Build search conditions
      //   searchCondition = searchQuery
      //     ? { name: { $regex: searchQuery, $options: "i" } }
      //     : {};

      if (dateRange) {
        const [start, end] = dateRange.split(",");
        searchCondition.date = {
          $gte: new Date(start.trim()),
          $lte: new Date(end.trim()),
        };
      }

      if (category) {
        searchCondition.category = category;
      }

      if (transactionType) {
        searchCondition.transactionType = transactionType;
      }

      const sortObject =
        sort === "name"
          ? { name: sortDirection }
          : { createdAt: sortDirection };

      // Fetch purchases with filters
      const purchases = await Purchase.find(searchCondition)
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortObject);

      // Count total documents with filters
      const totalPurchaseCount = await Purchase.countDocuments(searchCondition);

      // Total pages calculation
      const totalPagesCount = Math.ceil(totalPurchaseCount / limit);

      // Pagination links
      const links = {
        nextPage: totalPagesCount > page,
        previousPage: page > 1,
        currentPage: page,
        totalPages: totalPagesCount,
        limit: limit,
        loopableLinks: Array.from({ length: totalPagesCount }, (_, i) => ({
          number: i + 1,
        })),
      };

      // Fetch categories
      const categories = await Category.find({userId});

      const items = await Item.find({userId});

      // Prepare response
      const response = {
        links,
        data: {
          purchases,
          categories,
          items
        },
      };
      return res.json(response);
    } catch (error) {
      console.error("Error in index function:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getChartData: async (req, res) => {
    try {
      const allMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const userId = req.user._id;

      const purchases = await Purchase.find({userId}).populate("category");

      const groupedByMonth = allMonths.map((month) => {
        const monthData = {
          month,
          income: 0,
          outcome: 0,
        };

        purchases.forEach((purchase) => {
          const purchaseDate = new Date(purchase.date);
          const purchaseMonth = purchaseDate.toLocaleString("default", {
            month: "long",
          });
          if (purchaseMonth === month) {
            if (purchase.transactionType === "income") {
              monthData.income += purchase.amount || purchase.total;
            } else if (purchase.transactionType === "outcome") {
              monthData.outcome += purchase.amount || purchase.total;
            }
          }
        });

        return monthData;
      });

      let startDate, endDate;

      if (req.query.dateRange) {
        // Handle custom date range passed as 'dateRange=startDate,endDate'
        const [start, end] = req.query.dateRange.split(",");
        startDate = moment(start).utc().startOf("day").toDate();
        endDate = moment(end).utc().endOf("day").toDate();
      }

      let allDayData = [];

      let dayRangeDatas = [];
      let chartDatas = [];
      if (req.query.dateRange) {
        const rangeInDays = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        const daysInMonth = moment.utc(endDate).daysInMonth();
        const isDayRange = rangeInDays <= daysInMonth;

        if (isDayRange) {
          // Group by days
          const daysInRange = rangeInDays;

          dayRangeDatas = Array.from({ length: daysInRange }, (_, i) => {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);

            const dayEntry = {
              day: day.getDate(),
              income: 0,
              outcome: 0,
            };

            purchases.forEach((purchase) => {
              const purchaseDate = new Date(purchase.date);
              if (purchaseDate.toDateString() === day.toDateString()) {
                if (purchase.transactionType === "income") {
                  dayEntry.income += purchase.amount || purchase.total;
                } else if (purchase.transactionType === "outcome") {
                  dayEntry.outcome += purchase.amount || purchase.total;
                }
              }
            });

            return dayEntry;
          });
        } else {
          // Group by months
          const current = new Date(startDate);

          while (current <= endDate) {
            const month = current.getMonth();
            const year = current.getFullYear();

            const monthEntry = {
              month: allMonths[month],
              income: 0,
              outcome: 0,
            };

            purchases.forEach((purchase) => {
              const purchaseDate = new Date(purchase.date);
              if (
                purchaseDate.getMonth() === month &&
                purchaseDate.getFullYear() === year
              ) {
                if (purchase.transactionType === "income") {
                  monthEntry.income += purchase.amount || purchase.total;
                } else if (purchase.transactionType === "outcome") {
                  monthEntry.outcome += purchase.amount || purchase.total;
                }
              }
            });

            chartDatas.push(monthEntry);

            // Move to the next month
            current.setMonth(current.getMonth() + 1);
            current.setDate(1); // Reset to the first day of the next month
          }
        }
      }

      let dayData, chartData;
      if (req.query.dateRange) {
        dayData = dayRangeDatas;
        chartData = chartDatas;
      } else {
        // preset dates
        dayData = allDayData;
        chartData = groupedByMonth;
      }
      console.log('sortBy',req.query.sortBy);
      const matchConditions = {
        userId : userId,
        transactionType: req.query.sortBy || "outcome",
      };

      if (startDate && endDate) {
        matchConditions.date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const result = await Purchase.aggregate([
        // { $match: { transactionType: req.query.transactionType || "outcome" } },
        { $match: matchConditions },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryData",
          },
        },
        { $unwind: "$categoryData" },
        {
          $group: {
            _id: "$categoryData.name",
            total: { $sum: { $ifNull: ["$amount", "$total"] } },
          },
        },
        { $sort: { total: -1 } },
      ]);

      const chartPie = result.map((item) => ({
        category: item._id,
        total: item.total,
      }));

      console.log("chartPie",chartPie);

      const response = {
        data: {
          purchases: purchases,
          chartData: chartData,
          chartPie: chartPie,
          dayData,
        },
      };

      console.log("chartData", dayData);
      return res.json(response);
    } catch (error) {
      console.error("Error in getChartData:", error.message);
      return res.status(500).json({
        message: "An error occurred while fetching chart data.",
        error: error.message,
      });
    }
  },
  store: async (req, res) => {
    const {
      purchaseType,
      transactionType,
      category,
      description,
      date,
      amount,
      items,
      total,
    } = req.body;
    try {
      const userId = req.user._id;
      const purchase = await Purchase.create({
        purchaseType,
        transactionType,
        category,
        description,
        date,
        amount,
        items,
        total,
        userId
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
