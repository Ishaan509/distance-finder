const express = require("express");
const {apiGet , apiPost} = require("../controllers/api")

const router = express.Router();

router
.get("/",apiGet)
.post("/",apiPost);

module.exports = router;