import {
  type User,
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Vendor,
  type InsertVendor,
  type Item,
  type InsertItem,
  type Invoice,
  type InsertInvoice,
  type InvoiceItem,
  type InsertInvoiceItem,
  type Purchase,
  type InsertPurchase,
  type PurchaseItem,
  type InsertPurchaseItem,
  type LedgerEntry,
  type InsertLedgerEntry,
  type FinancialYear,
  type InsertFinancialYear,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Financial Years
  getFinancialYears(): Promise<FinancialYear[]>;
  getActiveFinancialYear(): Promise<FinancialYear | undefined>;
  createFinancialYear(fy: InsertFinancialYear): Promise<FinancialYear>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;

  // Items
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item>;
  deleteItem(id: string): Promise<void>;
  getLowStockItems(): Promise<Item[]>;

  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;
  createInvoice(invoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;
  getNextInvoiceNumber(): Promise<string>;

  // Purchases
  getPurchases(): Promise<Purchase[]>;
  getPurchase(id: string): Promise<Purchase | undefined>;
  getPurchaseItems(purchaseId: string): Promise<PurchaseItem[]>;
  createPurchase(purchase: InsertPurchase, items: InsertPurchaseItem[]): Promise<Purchase>;
  updatePurchase(id: string, purchase: Partial<InsertPurchase>): Promise<Purchase>;
  deletePurchase(id: string): Promise<void>;
  getNextPurchaseNumber(): Promise<string>;

  // Ledger
  getLedgerEntries(): Promise<LedgerEntry[]>;
  createLedgerEntry(entry: InsertLedgerEntry): Promise<LedgerEntry>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private financialYears: Map<string, FinancialYear> = new Map();
  private customers: Map<string, Customer> = new Map();
  private vendors: Map<string, Vendor> = new Map();
  private items: Map<string, Item> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private invoiceItems: Map<string, InvoiceItem[]> = new Map();
  private purchases: Map<string, Purchase> = new Map();
  private purchaseItems: Map<string, PurchaseItem[]> = new Map();
  private ledgerEntries: LedgerEntry[] = [];

  constructor() {
    // Initialize with default financial year
    const defaultFY: FinancialYear = {
      id: randomUUID(),
      name: "FY 2024-25",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2025-03-31"),
      isActive: true,
      createdAt: new Date(),
    };
    this.financialYears.set(defaultFY.id, defaultFY);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Financial Years
  async getFinancialYears(): Promise<FinancialYear[]> {
    return Array.from(this.financialYears.values());
  }

  async getActiveFinancialYear(): Promise<FinancialYear | undefined> {
    return Array.from(this.financialYears.values()).find(fy => fy.isActive);
  }

  async createFinancialYear(fy: InsertFinancialYear): Promise<FinancialYear> {
    const id = randomUUID();
    const financialYear: FinancialYear = { ...fy, id, createdAt: new Date() };
    this.financialYears.set(id, financialYear);
    return financialYear;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const newCustomer: Customer = { ...customer, id, createdAt: new Date() };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer> {
    const existing = this.customers.get(id);
    if (!existing) throw new Error("Customer not found");
    const updated = { ...existing, ...customer };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<void> {
    this.customers.delete(id);
  }

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const newVendor: Vendor = { ...vendor, id, createdAt: new Date() };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor> {
    const existing = this.vendors.get(id);
    if (!existing) throw new Error("Vendor not found");
    const updated = { ...existing, ...vendor };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: string): Promise<void> {
    this.vendors.delete(id);
  }

  // Items
  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(item: InsertItem): Promise<Item> {
    const id = randomUUID();
    const newItem: Item = { ...item, id, createdAt: new Date() };
    this.items.set(id, newItem);
    return newItem;
  }

  async updateItem(id: string, item: Partial<InsertItem>): Promise<Item> {
    const existing = this.items.get(id);
    if (!existing) throw new Error("Item not found");
    const updated = { ...existing, ...item };
    this.items.set(id, updated);
    return updated;
  }

  async deleteItem(id: string): Promise<void> {
    this.items.delete(id);
  }

  async getLowStockItems(): Promise<Item[]> {
    return Array.from(this.items.values()).filter(
      item => parseFloat(item.currentStock || "0") <= parseFloat(item.minimumStock || "0")
    );
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return this.invoiceItems.get(invoiceId) || [];
  }

  async createInvoice(invoice: InsertInvoice, items: InsertInvoiceItem[]): Promise<Invoice> {
    const id = randomUUID();
    const newInvoice: Invoice = { ...invoice, id, createdAt: new Date() };
    this.invoices.set(id, newInvoice);
    
    const invoiceItemsWithIds = items.map(item => ({
      ...item,
      id: randomUUID(),
      invoiceId: id,
    }));
    this.invoiceItems.set(id, invoiceItemsWithIds);

    // Update stock levels
    for (const item of items) {
      const inventoryItem = this.items.get(item.itemId);
      if (inventoryItem) {
        const newStock = parseFloat(inventoryItem.currentStock || "0") - parseFloat(item.quantity);
        await this.updateItem(item.itemId, { currentStock: newStock.toString() });
      }
    }

    return newInvoice;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const existing = this.invoices.get(id);
    if (!existing) throw new Error("Invoice not found");
    const updated = { ...existing, ...invoice };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: string): Promise<void> {
    // Only allow deletion of the last invoice
    const invoices = await this.getInvoices();
    if (invoices.length === 0) return;
    
    const lastInvoice = invoices[0]; // Already sorted by date
    if (lastInvoice.id !== id) {
      throw new Error("Only the last invoice can be deleted");
    }

    // Restore stock levels
    const items = this.invoiceItems.get(id) || [];
    for (const item of items) {
      const inventoryItem = this.items.get(item.itemId);
      if (inventoryItem) {
        const newStock = parseFloat(inventoryItem.currentStock || "0") + parseFloat(item.quantity);
        await this.updateItem(item.itemId, { currentStock: newStock.toString() });
      }
    }

    this.invoices.delete(id);
    this.invoiceItems.delete(id);
  }

  async getNextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const invoices = await this.getInvoices();
    const count = invoices.length + 1;
    return `INV-${year}-${count.toString().padStart(3, '0')}`;
  }

  // Purchases
  async getPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async getPurchase(id: string): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }

  async getPurchaseItems(purchaseId: string): Promise<PurchaseItem[]> {
    return this.purchaseItems.get(purchaseId) || [];
  }

  async createPurchase(purchase: InsertPurchase, items: InsertPurchaseItem[]): Promise<Purchase> {
    const id = randomUUID();
    const newPurchase: Purchase = { ...purchase, id, createdAt: new Date() };
    this.purchases.set(id, newPurchase);
    
    const purchaseItemsWithIds = items.map(item => ({
      ...item,
      id: randomUUID(),
      purchaseId: id,
    }));
    this.purchaseItems.set(id, purchaseItemsWithIds);

    // Update stock levels
    for (const item of items) {
      const inventoryItem = this.items.get(item.itemId);
      if (inventoryItem) {
        const newStock = parseFloat(inventoryItem.currentStock || "0") + parseFloat(item.quantity);
        await this.updateItem(item.itemId, { currentStock: newStock.toString() });
      }
    }

    return newPurchase;
  }

  async updatePurchase(id: string, purchase: Partial<InsertPurchase>): Promise<Purchase> {
    const existing = this.purchases.get(id);
    if (!existing) throw new Error("Purchase not found");
    const updated = { ...existing, ...purchase };
    this.purchases.set(id, updated);
    return updated;
  }

  async deletePurchase(id: string): Promise<void> {
    // Restore stock levels
    const items = this.purchaseItems.get(id) || [];
    for (const item of items) {
      const inventoryItem = this.items.get(item.itemId);
      if (inventoryItem) {
        const newStock = parseFloat(inventoryItem.currentStock || "0") - parseFloat(item.quantity);
        await this.updateItem(item.itemId, { currentStock: newStock.toString() });
      }
    }

    this.purchases.delete(id);
    this.purchaseItems.delete(id);
  }

  async getNextPurchaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const purchases = await this.getPurchases();
    const count = purchases.length + 1;
    return `PUR-${year}-${count.toString().padStart(3, '0')}`;
  }

  // Ledger
  async getLedgerEntries(): Promise<LedgerEntry[]> {
    return [...this.ledgerEntries].sort(
      (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async createLedgerEntry(entry: InsertLedgerEntry): Promise<LedgerEntry> {
    const id = randomUUID();
    const newEntry: LedgerEntry = { ...entry, id, createdAt: new Date() };
    this.ledgerEntries.push(newEntry);
    return newEntry;
  }
}

export const storage = new MemStorage();
