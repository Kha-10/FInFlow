const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const itemsRoutes = require("./routes/items");
const categoriesRoutes = require("./routes/categories");
const purchasesRoutes = require("./routes/purchases");
const usersRoutes = require("./routes/users");
const cookieParser = require("cookie-parser");
const AuthMiddleware = require("./middlewares/AuthMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

console.log("origin",process.env.ORIGIN);

// const mongoURL =
//   "mongodb+srv://finflow:finflow123@finflow-cluster.jwtny.mongodb.net/?retryWrites=true&w=majority&appName=FInflow-Cluster";
const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(() => {
  console.log(`connected to db`);
  app.listen(process.env.PORT, () => {
    console.log(`app is running on localhost:${process.env.PORT}`);
  });
});

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ msg: "hello" });
});

app.use("/api/items", AuthMiddleware, itemsRoutes);

app.use("/api/categories", AuthMiddleware, categoriesRoutes);

app.use("/api/purchases", AuthMiddleware, purchasesRoutes);

app.use("/api/users", usersRoutes);

app.get("/set-cookie", (req, res) => {
  res.cookie("name", "kha");
  return res.send("cookie already set");
});
