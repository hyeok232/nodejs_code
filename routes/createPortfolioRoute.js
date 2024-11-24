const express = require("express");
const createPortfolioRouter = express.Router();
const createPortfolioController = require("../controllers/createPortfolioContoller");

/**
 * @swagger
 * /api/create-portfolio:
 *   post:
 *     summary: Generate an investment portfolio
 *     description: Processes survey data and generates a customized investment portfolio based on the user's preferences and rankings.
 *     tags:
 *       - Survey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyAnswers:
 *                 type: object
 *                 description: User's responses to the survey questions.
 *                 example:
 *                   question1: true
 *                   question2: false
 *                   question3: true
 *                   question4: false
 *                   question5: true
 *                   question6: false
 *                   question7: true
 *                   question8: false
 *                   question9: true
 *                   question10: false
 *                   question11: true
 *                   question12: false
 *                   question13: true
 *                   question14: false
 *                   question15: true
 *                   question16: false
 *                   question17: true
 *                   question18: false
 *                   question19: true
 *                   question20: false
 *                   question21: true
 *               companyValuesRanks:
 *                 type: object
 *                 description: User's rankings for company evaluation metrics.
 *                 example:
 *                   per: 1
 *                   pbr: 2
 *                   roe: 3
 *                   dividendYield: 4
 *                   dividendPayout: 5
 *               numberOfCompanies:
 *                 type: integer
 *                 description: The number of companies to include in the portfolio.
 *                 example: 5
 *               investmentAmount:
 *                 type: number
 *                 description: The total investment amount.
 *                 example: 100000
 *     responses:
 *       200:
 *         description: Investment portfolio generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stockPurchaseDetails:
 *                   type: array
 *                   description: Details of the stocks to purchase.
 *                   items:
 *                     type: object
 *                     properties:
 *                       stock:
 *                         type: string
 *                         description: Stock name.
 *                       price:
 *                         type: number
 *                         description: Stock price.
 *                       shares:
 *                         type: integer
 *                         description: Number of shares to purchase.
 *                       totalCost:
 *                         type: number
 *                         description: Total cost for this stock.
 *                 traits:
 *                   type: object
 *                   description: Calculated user traits based on survey answers.
 *                   properties:
 *                     profit:
 *                       type: number
 *                       description: Profit-oriented score.
 *                       example: 3.62
 *                     analysis:
 *                       type: number
 *                       description: Analysis-oriented score.
 *                       example: 2.98
 *                     safety:
 *                       type: number
 *                       description: Safety-oriented score.
 *                       example: 2.56
 *                     obsession:
 *                       type: number
 *                       description: Obsession-oriented score.
 *                       example: 2.64
 *               example:
 *                 stockPurchaseDetails:
 *                   - stock: "Samsung Electronics"
 *                     price: 70000
 *                     shares: 10
 *                     totalCost: 700000
 *                   - stock: "LG Display"
 *                     price: 20000
 *                     shares: 15
 *                     totalCost: 300000
 *                 traits:
 *                   profit: 3.62
 *                   analysis: 2.98
 *                   safety: 2.56
 *                   obsession: 2.64
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid surveyAnswers format."
 *       500:
 *         description: Internal server error while processing survey data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error while processing portfolio."
 */
createPortfolioRouter.post("", createPortfolioController.getSurveyData);

module.exports = createPortfolioRouter;
