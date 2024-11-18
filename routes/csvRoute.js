// csvRoute.js
const express = require("express");
const csvRouter = express.Router();
const csvController = require("../controllers/csvController");

/**
 * @swagger
 * /api/csv/loadcsv:
 *   post:
 *     summary: Load CSV data based on the provided dominant trait
 *     description: Loads a CSV file corresponding to the provided dominant trait and returns the data.
 *     tags:
 *       - CSV
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dominantTrait:
 *                 type: string
 *                 description: The dominant trait based on user survey
 *                 example: "safety"
 *     responses:
 *       200:
 *         description: Successfully loaded CSV data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Code:
 *                     type: string
 *                   Name:
 *                     type: string
 *                   PER:
 *                     type: number
 *                   PBR:
 *                     type: number
 *                   ROE:
 *                     type: number
 *                   배당수익률:
 *                     type: number
 *                   배당성향:
 *                     type: number
 *       500:
 *         description: Error loading CSV data
 */
csvRouter.post("/loadcsv", csvController.loadCsv);

/**
 * @swagger
 * /api/csv/selectstocks:
 *   get:
 *     summary: Select stocks based on survey result and ranking
 *     description: Selects top stocks based on the user's dominant trait and ranking metrics stored in the session.
 *     tags:
 *       - CSV
 *     responses:
 *       200:
 *         description: Successfully selected stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Code:
 *                     type: string
 *                   Name:
 *                     type: string
 *                   Weighted_Rank:
 *                     type: number
 *       400:
 *         description: Missing session data
 *       500:
 *         description: Error selecting stocks
 */
csvRouter.get("/selectstocks", csvController.selectStocks);

/**
 * @swagger
 * /api/csv/purchasestocks:
 *   get:
 *     summary: Purchase stocks based on selected stocks and investment amount
 *     description: Recommends stock purchases based on the top selected stocks and the investment amount provided.
 *     tags:
 *       - CSV
 *     responses:
 *       200:
 *         description: Successfully calculated stock purchase plan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   stockPurchaseDetails:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         stock:
 *                           type: string
 *                         price:
 *                           type: number
 *                         shares:
 *                           type: number
 *                         totalCost:
 *                           type: number
 *       400:
 *         description: Missing session data or query parameters
 *       500:
 *         description: Error calculating stock purchase plan
 */
csvRouter.get("/purchasestocks", csvController.purchaseStocks);

module.exports = csvRouter;
