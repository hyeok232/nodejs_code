// countRoute.js
const express = require("express");
const countRouter = express.Router();
const countcontroller = require("../controllers/countController");

countRouter.get("/", (req, res) => {
  res.render("count_survey"); // 테스트용 ejs
});

countRouter.post("/submit", countcontroller.getCount);

module.exports = countRouter;
