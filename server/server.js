const express = require("express");
const bodyParser = require('body-parser')
const {connectMongo} = require("./connection");
const {handleRequestResponse} = require("./middlewares/index");
const dotenv=require("dotenv");
const apiRouter = require("./routes/api");

dotenv.config();
const app = express();

//CONNECTION
connectMongo(process.env.MONGO_URI).then(()=>{console.log("MongoDB connected!");});

//MIDDLEWARE
app.use(handleRequestResponse());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//ROUTES
app.use("/api", apiRouter);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server up and running!!");
});