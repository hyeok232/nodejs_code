// csvRoute.js
const express = require('express');
const csvRouter = express.Router();
const csvController = require('../controllers/csvController');

csvRouter.get('/loadcsv', csvController.loadCsv);
csvRouter.get('/selectstocks', csvController.selectStocks);
csvRouter.get('/purchasestocks', csvController.purchaseStocks);

module.exports = csvRouter;
