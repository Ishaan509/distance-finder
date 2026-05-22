const express = require("express");
const {apiGet , apiPost, apiMaxDistance} = require("../controllers/api")

const router = express.Router();

router
.get("/",apiGet)
.get("/distFetch", apiMaxDistance)
.post("/",apiPost);

module.exports = router;