// propensityRoute.js
const express = require("express");
const propensityRouter = express.Router();
const propensityController = require("../controllers/propensityController");

/**
 * @swagger
 * /api/propensity:
 *   get:
 *     summary: Render the propensity survey page
 *     description: Renders the EJS view for the propensity survey.
 *     tags:
 *       - Propensity
 *     responses:
 *       200:
 *         description: Successfully rendered the propensity survey page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
propensityRouter.get("/", (req, res) => {
  res.render("propensity_survey"); // 테스트용 ejs
});

/**
 * @swagger
 * /api/propensity/submit:
 *   post:
 *     summary: Submit the propensity survey responses
 *     description: Calculates the user's dominant trait based on their survey responses.
 *     tags:
 *       - Propensity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question1:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question2:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question3:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question4:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question5:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question6:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question7:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question8:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question9:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question10:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question11:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question12:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question13:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question14:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question15:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question16:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question17:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question18:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question19:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question20:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *               question21:
 *                 type: string
 *                 enum: ["예", "아니오"]
 *                 example: "예"
 *     responses:
 *       200:
 *         description: Returns the dominant trait based on the survey responses
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "가장 높은 성향은 profit입니다."
 *       500:
 *         description: Session save error
 */
propensityRouter.post("/submit", propensityController.surveyWeight);

module.exports = propensityRouter;
