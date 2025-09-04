import express from "express";
import customersRouter from "./api/customers";

export async function registerRoutes(app: express.Express) {
  app.use("/api/customers", customersRouter);
  return app;
}
