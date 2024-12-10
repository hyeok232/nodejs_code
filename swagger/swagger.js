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
        url: "https://port-0-nodejs-code-m3n1flsr1f4f9ad0.sel4.cloudtype.app", // API 서버의 URL로 변경
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, specs };
