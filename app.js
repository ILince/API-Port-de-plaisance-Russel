const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

// Import routes and controllers
const indexRouter = require("./routes/index_routes");
const mongodb = require("./db/mongo");

// Initialize MongoDB connection
mongodb.initClienDbConnection();

const app = express();

// Middleware setup
app.use(
  cors({
    exposedHeaders: ["Authorization"],
    origin: "*",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up the view engine and views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve JSDoc documentation
const docsPath = path.join(__dirname, 'docs'); 
app.use('/docs', express.static(docsPath));

// Principal route
app.use("/", indexRouter);

// 404 handler for unmatched routess
app.use((req, res) => {
  res.status(404).json({
    name: "API",
    version: "1.0",
    status: 404,
    message: "not_found",
  });
});

module.exports = app;
