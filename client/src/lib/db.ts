import Dexie, { Table } from 'dexie';
import {
  Customer,
  Vendor,
  Item,
  Invoice,
  InvoiceItem,
  Purchase,
  PurchaseItem,
  LedgerEntry,
  FinancialYear,
} from '@shared/schema';

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export interface PurchaseWithItems extends Purchase {
  items: PurchaseItem[];
}

export class AccountingDB extends Dexie {
  customers!: Table<Customer>;
  vendors!: Table<Vendor>;
  items!: Table<Item>;
  invoices!: Table<Invoice>;
  invoiceItems!: Table<InvoiceItem>;
  purchases!: Table<Purchase>;
  purchaseItems!: Table<PurchaseItem>;
  ledgerEntries!: Table<LedgerEntry>;
  financialYears!: Table<FinancialYear>;

  constructor() {
    super('AccountingDB');
    this.version(1).stores({
      customers: 'id, name, gstin, phone, email',
      vendors: 'id, name, gstin, phone, email',
      items: 'id, name, hsn, currentStock, minimumStock',
      invoices: 'id, invoiceNumber, customerId, invoiceDate, status',
      invoiceItems: 'id, invoiceId, itemId',
      purchases: 'id, purchaseNumber, vendorId, purchaseDate',
      purchaseItems: 'id, purchaseId, itemId',
      ledgerEntries: 'id, entryDate, referenceType, referenceId',
      financialYears: 'id, name, isActive',
    });
  }
}

export const db = new AccountingDB();

// Initialize with default data if needed
db.on('ready', async () => {
  const fyCount = await db.financialYears.count();
  if (fyCount === 0) {
    await db.financialYears.add({
      id: crypto.randomUUID(),
      name: 'FY 2024-25',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      isActive: true,
      createdAt: new Date(),
    });
  }
});
