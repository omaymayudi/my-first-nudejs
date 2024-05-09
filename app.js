const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");
const cookieParse = require("cookie-parser");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const dotenv = require("dotenv").config();
const path = require("path");

// Require Routes
const productRouter = require("./routes/productRouter");
const routerCatagories = require("./routes/catagories");
const routerAuth = require("./routes/AuthRouter");
const profileRouter = require("./routes/profileRouter")
const reviewRouter = require("./routes/reviewRouter")

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(morgan("dev"));
app.use(cors());
// Public File
app.use(
  "/public/uploads/products",
  express.static(path.join(__dirname + "/public/uploads/products"))
);

// Routing
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/categories", routerCatagories);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/auth", routerAuth);
app.use(notFound);
app.use(errorHandler);

// Run Server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
