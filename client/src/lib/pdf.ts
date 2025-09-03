import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Invoice, InvoiceItem, Customer, Item } from '@shared/schema';

interface InvoiceWithDetails extends Invoice {
  customer: Customer;
  items: (InvoiceItem & { item: Item })[];
}

export function generateInvoicePDF(invoice: InvoiceWithDetails) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('INVOICE', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('AccountingPro', 20, 40);
  doc.text('123 Business Street', 20, 50);
  doc.text('City, State 12345', 20, 60);
  doc.text('Phone: (555) 123-4567', 20, 70);
  
  // Invoice details
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 120, 40);
  doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, 120, 50);
  if (invoice.dueDate) {
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 120, 60);
  }
  
  // Customer details
  doc.text('Bill To:', 20, 90);
  doc.text(invoice.customer.name, 20, 100);
  if (invoice.customer.address) {
    doc.text(invoice.customer.address, 20, 110);
  }
  if (invoice.customer.gstin) {
    doc.text(`GSTIN: ${invoice.customer.gstin}`, 20, 120);
  }
  
  // Items table
  const tableData = invoice.items.map((item, index) => [
    index + 1,
    item.item.name,
    item.item.hsn || '',
    parseFloat(item.quantity).toFixed(2),
    parseFloat(item.rate).toFixed(2),
    `${parseFloat(item.taxRate).toFixed(1)}%`,
    parseFloat(item.amount).toFixed(2),
  ]);
  
  (doc as any).autoTable({
    startY: 140,
    head: [['S.No', 'Item', 'HSN', 'Qty', 'Rate', 'Tax', 'Amount']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [52, 152, 219] },
  });
  
  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const rightAlign = 190;
  
  doc.text(`Subtotal: ₹${parseFloat(invoice.subtotal).toFixed(2)}`, rightAlign, finalY, { align: 'right' });
  
  if (parseFloat(invoice.cgstAmount || '0') > 0) {
    doc.text(`CGST: ₹${parseFloat(invoice.cgstAmount || '0').toFixed(2)}`, rightAlign, finalY + 10, { align: 'right' });
  }
  
  if (parseFloat(invoice.sgstAmount || '0') > 0) {
    doc.text(`SGST: ₹${parseFloat(invoice.sgstAmount || '0').toFixed(2)}`, rightAlign, finalY + 20, { align: 'right' });
  }
  
  if (parseFloat(invoice.igstAmount || '0') > 0) {
    doc.text(`IGST: ₹${parseFloat(invoice.igstAmount || '0').toFixed(2)}`, rightAlign, finalY + 10, { align: 'right' });
  }
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: ₹${parseFloat(invoice.totalAmount).toFixed(2)}`, rightAlign, finalY + 30, { align: 'right' });
  
  // Footer
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  
  return doc;
}

export function generateBalanceSheetPDF(data: any) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('BALANCE SHEET', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`As on ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
  // Assets and Liabilities side by side
  const assets = [
    ['Current Assets'],
    ['Cash & Bank', '₹2,45,000'],
    ['Accounts Receivable', '₹3,24,150'],
    ['Inventory', '₹5,67,890'],
    ['Total Current Assets', '₹11,37,040'],
    [''],
    ['Fixed Assets'],
    ['Plant & Machinery', '₹8,50,000'],
    ['Furniture & Fixtures', '₹1,20,000'],
    ['Total Fixed Assets', '₹9,70,000'],
    [''],
    ['TOTAL ASSETS', '₹21,07,040'],
  ];
  
  const liabilities = [
    ['Current Liabilities'],
    ['Accounts Payable', '₹2,85,400'],
    ['GST Payable', '₹45,680'],
    ['Other Liabilities', '₹32,100'],
    ['Total Current Liabilities', '₹3,63,180'],
    [''],
    ['Owner\'s Equity'],
    ['Capital', '₹15,00,000'],
    ['Retained Earnings', '₹2,43,860'],
    ['Total Owner\'s Equity', '₹17,43,860'],
    [''],
    ['TOTAL LIABILITIES', '₹21,07,040'],
  ];
  
  (doc as any).autoTable({
    startY: 50,
    body: assets,
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign: 'right' } },
    margin: { left: 20, right: 105 },
  });
  
  (doc as any).autoTable({
    startY: 50,
    body: liabilities,
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign: 'right' } },
    margin: { left: 105, right: 20 },
  });
  
  return doc;
}
