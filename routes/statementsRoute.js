// statementsRoute.js
const express = require("express");
const statementsRouter = express.Router();
const statementsController = require("../controllers/statementsController");

/**
 * @swagger
 * /api/statements:
 *   get:
 *     summary: Render the statements survey page
 *     description: Renders the EJS view for the financial statements survey.
 *     tags:
 *       - Statements
 *     responses:
 *       200:
 *         description: Successfully rendered the statements survey page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
statementsRouter.get("/", (req, res) => {
  res.render("statements_survey");
});

/**
 * @swagger
 * /api/statements/submit:
 *   post:
 *     summary: Submit the financial metrics for ranking
 *     description: Receives financial metrics from the client and returns a ranked list based on priority values.
 *     tags:
 *       - Statements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               per:
 *                 type: number
 *                 description: Price-Earnings Ratio (PER)
 *                 example: 10
 *               pbr:
 *                 type: number
 *                 description: Price-Book Ratio (PBR)
 *                 example: 1.5
 *               roe:
 *                 type: number
 *                 description: Return on Equity (ROE)
 *                 example: 15
 *               dividendYield:
 *                 type: number
 *                 description: Dividend Yield
 *                 example: 3.5
 *               dividendPayout:
 *                 type: number
 *                 description: Dividend Payout Ratio
 *                 example: 40
 *     responses:
 *       200:
 *         description: Successfully ranked the financial metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rankedMetrics:
 *                   type: array
 *                   description: Ranked list of financial metrics
 *                   example: ["ROE", "PER", "PBR", "배당수익률", "배당성향"]
 *       500:
 *         description: Session save error
 */
statementsRouter.post("/submit", statementsController.getRanked);

module.exports = statementsRouter;
