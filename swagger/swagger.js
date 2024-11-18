const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Predictfolio Api",
      version: "1.0.0",
      description: "Predictfolio Api Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000", // API 서버의 URL로 변경
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, specs };
