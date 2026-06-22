import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger-spec";

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "PayPlus Wallet API",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
    },
  }));

  app.get("/api-docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });
}
