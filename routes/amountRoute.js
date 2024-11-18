// amountRoute.js
const express = require("express");
const amountRouter = express.Router();
const amountcontroller = require("../controllers/amountContoller");

/**
 * @swagger
 * /api/amount:
 *   get:
 *     summary: Render the amount survey page
 *     description: Renders the EJS view for the amount survey.
 *     tags:
 *       - Amount
 *     responses:
 *       200:
 *         description: Successfully rendered the amount survey page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
amountRouter.get("/", (req, res) => {
  res.render("amount_survey"); // 테스트용 ejs
});

/**
 * @swagger
 * /api/amount/submit:
 *   post:
 *     summary: Submit the amount data
 *     description: Receives the amount from the client, stores it in the session, and returns the amount in the response.
 *     tags:
 *       - Amount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: The amount value submitted by the user
 *                 example: 100
 *     responses:
 *       200:
 *         description: Successfully received and stored the amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: integer
 *                   description: The amount value returned
 *                   example: 100
 *       500:
 *         description: Session save error
 */
amountRouter.post("/submit", amountcontroller.getAmount);

module.exports = amountRouter;
