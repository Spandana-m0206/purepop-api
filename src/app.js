require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const routes = require("./modules");
const compression = require("compression");
const { ErrorMiddleware } = require("./middlewares/error.middleware");

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());

// Body parser
app.use(express.json());

// API Routes
app.use("/api", routes);

// Error Handler
app.use(ErrorMiddleware);

module.exports = app;
