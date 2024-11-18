// app.js
const express = require("express");
const session = require("express-session");

const csvRoute = require("./routes/csvRoute");
const propensityRoute = require("./routes/propensityRoute");
const statementsRoute = require("./routes/statementsRoute");
const countRoute = require("./routes/countRoute");
const amountRoute = require("./routes/amountRoute");

const { swaggerUi, specs } = require("./swagger/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.use("/api/propensity", propensityRoute);
app.use("/api/statements", statementsRoute);

app.use("/api/csv", csvRoute);
app.use("/api/count", countRoute);
app.use("/api/amount", amountRoute);

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 서버 확인용
// app.get("/", (req, res) =>{
//     res.send("Hello, world!");
// });
