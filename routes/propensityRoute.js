// propensityRoute.js
const express = require('express');
const propensityRouter = express.Router();
const propensityController = require('../controllers/propensityController');

propensityRouter.get('/', (req, res) => {
    res.render('propensity_survey'); // 테스트용 ejs
});

propensityRouter.post('/submit', propensityController.surveyWeight); 

module.exports = propensityRouter;
