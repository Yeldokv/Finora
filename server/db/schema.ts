import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

// Customers table
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address"),
  gstin: text("gstin"),
  phone: text("phone"),
  email: text("email"),
  referenceNo: integer("referenceNo").unique().notNull(),
});

// Items table
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  hsn: text("hsn"),
  rate: real("rate").notNull(),
  taxRate: real("taxRate"),
  openingStock: integer("openingStock").default(0),
  closingStock: integer("closingStock").default(0),
});
