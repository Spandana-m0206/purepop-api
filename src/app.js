require("dotenv").config();

const express =require("express");
const helmet =require("helmet");
const routes=require("./modules");
const compression=require("compression");
const {connectDB}=require("./config/database");

const app=express();

//security Middlewares
app.use(helmet());
app.use(compression());

//body parser
app.use(express.json());

//routes
app.use("/api", routes);

// Error Handling Middleware
app.use(require("./middlewares/error.middleware"));

//connect to Database
connectDB();

module.exports= app;
