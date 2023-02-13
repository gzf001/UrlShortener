const express = require("express");
const router = express.Router();

const urlShortenerController = require("../controllers/urlShortener.controller");

router.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

router.post("/", urlShortenerController.createShort);

router.get("/longUrl/:shortUrl", urlShortenerController.recoveryLong);
  
module.exports = router;