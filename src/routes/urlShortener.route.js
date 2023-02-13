const express = require("express");
const router = express.Router();

const urlShortenerController = require("../controllers/urlShortener.controller");

router.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

router.post("/", urlShortenerController.createShort);

router.get("/longUrl/:shortUrl", urlShortenerController.recoveryLong);

router.get("/:shortUrl", urlShortenerController.redirect);

router.get("/deleteByShort/:shortUrl", urlShortenerController.deleteByShort);

router.post("/deleteByLong", urlShortenerController.deleteByLong);
  
module.exports = router;