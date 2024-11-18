// statementsRoute.js
const express = require('express');
const statementsRouter = express.Router();
const statementsController = require('../controllers/statementsController');

statementsRouter.get('/', (req, res) => {
    res.render('statements_survey'); // 테스트용 ejs
});

statementsRouter.post('/submit', statementsController.getRanked);

module.exports = statementsRouter;
