// amountRoute.js
const express = require('express');
const amountRouter = express.Router();
const amountcontroller = require('../controllers/amountContoller');

amountRouter.get('/', (req, res) => {
    res.render('amount_survey'); // 테스트용 ejs
});

amountRouter.post('/submit', amountcontroller.getAmount); 

module.exports = amountRouter;