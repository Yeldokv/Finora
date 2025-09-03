import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCustomerSchema,
  insertVendorSchema,
  insertItemSchema,
  insertInvoiceSchema,
  insertPurchaseSchema,
  insertLedgerEntrySchema,
  insertFinancialYearSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Financial Years
  app.get("/api/financial-years", async (req, res) => {
    try {
      const financialYears = await storage.getFinancialYears();
      res.json(financialYears);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial years" });
    }
  });

  app.get("/api/financial-years/active", async (req, res) => {
    try {
      const activeYear = await storage.getActiveFinancialYear();
      res.json(activeYear);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active financial year" });
    }
  });

  app.post("/api/financial-years", async (req, res) => {
    try {
      const data = insertFinancialYearSchema.parse(req.body);
      const financialYear = await storage.createFinancialYear(data);
      res.json(financialYear);
    } catch (error) {
      res.status(400).json({ message: "Invalid financial year data" });
    }
  });

  // Customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(data);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(id, data);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCustomer(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Vendors
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const data = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(data);
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(id, data);
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteVendor(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vendor" });
    }
  });

  // Items
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get("/api/items/low-stock", async (req, res) => {
    try {
      const items = await storage.getLowStockItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const data = insertItemSchema.parse(req.body);
      const item = await storage.createItem(data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  app.put("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await storage.getInvoice(id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const items = await storage.getInvoiceItems(id);
      res.json({ ...invoice, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.get("/api/invoices/next-number", async (req, res) => {
    try {
      const nextNumber = await storage.getNextInvoiceNumber();
      res.json({ nextNumber });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate invoice number" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const { items, ...invoiceData } = req.body;
      const validatedInvoice = insertInvoiceSchema.parse(invoiceData);
      const invoice = await storage.createInvoice(validatedInvoice, items);
      res.json(invoice);
    } catch (error) {
      res.status(400).json({ message: "Invalid invoice data" });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteInvoice(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to delete invoice" });
    }
  });

  // Purchases
  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  app.get("/api/purchases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const purchase = await storage.getPurchase(id);
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      const items = await storage.getPurchaseItems(id);
      res.json({ ...purchase, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchase" });
    }
  });

  app.get("/api/purchases/next-number", async (req, res) => {
    try {
      const nextNumber = await storage.getNextPurchaseNumber();
      res.json({ nextNumber });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate purchase number" });
    }
  });

  app.post("/api/purchases", async (req, res) => {
    try {
      const { items, ...purchaseData } = req.body;
      const validatedPurchase = insertPurchaseSchema.parse(purchaseData);
      const purchase = await storage.createPurchase(validatedPurchase, items);
      res.json(purchase);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase data" });
    }
  });

  app.delete("/api/purchases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePurchase(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete purchase" });
    }
  });

  // Ledger
  app.get("/api/ledger", async (req, res) => {
    try {
      const entries = await storage.getLedgerEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ledger entries" });
    }
  });

  app.post("/api/ledger", async (req, res) => {
    try {
      const data = insertLedgerEntrySchema.parse(req.body);
      const entry = await storage.createLedgerEntry(data);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid ledger entry data" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      const purchases = await storage.getPurchases();
      const lowStockItems = await storage.getLowStockItems();

      const totalSales = invoices
        .filter(inv => inv.status === "PAID")
        .reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0);

      const outstanding = invoices
        .filter(inv => inv.status === "PENDING")
        .reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0);

      const totalPurchases = purchases
        .reduce((sum, pur) => sum + parseFloat(pur.totalAmount), 0);

      const netProfit = totalSales - totalPurchases;

      res.json({
        totalSales,
        outstanding,
        totalPurchases,
        netProfit,
        pendingInvoicesCount: invoices.filter(inv => inv.status === "PENDING").length,
        lowStockItemsCount: lowStockItems.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
