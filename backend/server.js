const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const itemsRoutes = require("./routes/items");
const categoriesRoutes = require("./routes/categories");
const purchasesRoutes = require("./routes/purchases");

const app = express();

app.use(
    cors({
      origin: process.env.ORIGIN,
    //   credentials: true,
    })
  );

const mongoURL =
  "mongodb+srv://finflow:finflow123@finflow-cluster.jwtny.mongodb.net/?retryWrites=true&w=majority&appName=FInflow-Cluster";

mongoose.connect(mongoURL).then(() => {
  console.log(`connected to db`);
  app.listen(process.env.PORT, () => {
    console.log(`app is running on localhost:${process.env.PORT}`);
  });
});

app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ msg: "hello" });
});

app.use("/api/items", itemsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use("/api/purchases", purchasesRoutes);