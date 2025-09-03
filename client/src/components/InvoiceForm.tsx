import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { generateInvoicePDF } from '@/lib/pdf';

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customerId: z.string().min(1, 'Customer is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

interface InvoiceItem {
  itemId: string;
  quantity: string;
  rate: string;
  taxRate: string;
  amount: string;
}

export default function InvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { itemId: '', quantity: '1', rate: '0', taxRate: '18', amount: '0' }
  ]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: '',
      customerId: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      notes: '',
    },
  });

  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  const { data: inventoryItems } = useQuery({
    queryKey: ['/api/items'],
  });

  const { data: nextNumber } = useQuery({
    queryKey: ['/api/invoices/next-number'],
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/invoices', data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      form.reset();
      setItems([{ itemId: '', quantity: '1', rate: '0', taxRate: '18', amount: '0' }]);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invoice',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (nextNumber?.nextNumber) {
      form.setValue('invoiceNumber', nextNumber.nextNumber);
    }
  }, [nextNumber, form]);

  const addItem = () => {
    setItems([...items, { itemId: '', quantity: '1', rate: '0', taxRate: '18', amount: '0' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Update rate and tax rate when item is selected
    if (field === 'itemId' && value) {
      const item = inventoryItems?.find((item: any) => item.id === value);
      if (item) {
        newItems[index].rate = item.rate;
        newItems[index].taxRate = item.taxRate;
      }
    }

    // Calculate amount
    if (['quantity', 'rate', 'taxRate'].includes(field)) {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      const taxRate = parseFloat(newItems[index].taxRate) || 0;
      const subtotal = quantity * rate;
      const tax = (subtotal * taxRate) / 100;
      newItems[index].amount = (subtotal + tax).toFixed(2);
    }

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + (quantity * rate);
    }, 0);

    const totalTax = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const taxRate = parseFloat(item.taxRate) || 0;
      const itemSubtotal = quantity * rate;
      return sum + ((itemSubtotal * taxRate) / 100);
    }, 0);

    const cgst = totalTax / 2;
    const sgst = totalTax / 2;
    const total = subtotal + totalTax;

    return { subtotal, cgst, sgst, total };
  };

  const onSubmit = async (data: z.infer<typeof invoiceSchema>) => {
    if (items.some(item => !item.itemId)) {
      toast({
        title: 'Error',
        description: 'Please select items for all rows',
        variant: 'destructive',
      });
      return;
    }

    const totals = calculateTotals();
    const invoiceData = {
      ...data,
      invoiceDate: new Date(data.invoiceDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      subtotal: totals.subtotal.toString(),
      cgstAmount: totals.cgst.toString(),
      sgstAmount: totals.sgst.toString(),
      igstAmount: '0',
      totalAmount: totals.total.toString(),
      status: 'PENDING',
      items: items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        rate: item.rate,
        taxRate: item.taxRate,
        amount: item.amount,
      })),
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly data-testid="input-invoice-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-invoice-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-due-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Customer Selection */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-customer">
                          <SelectValue placeholder="Select Customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.map((customer: any) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Invoice Items</h3>
                  <Button
                    type="button"
                    onClick={addItem}
                    size="sm"
                    data-testid="button-add-item"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Item
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-md">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Item</th>
                        <th className="text-left p-3 text-sm font-medium">HSN</th>
                        <th className="text-right p-3 text-sm font-medium">Qty</th>
                        <th className="text-right p-3 text-sm font-medium">Rate</th>
                        <th className="text-right p-3 text-sm font-medium">Tax %</th>
                        <th className="text-right p-3 text-sm font-medium">Amount</th>
                        <th className="text-center p-3 text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => {
                        const selectedItem = inventoryItems?.find((i: any) => i.id === item.itemId);
                        return (
                          <tr key={index} className="border-t border-border">
                            <td className="p-3">
                              <Select
                                value={item.itemId}
                                onValueChange={(value) => updateItem(index, 'itemId', value)}
                              >
                                <SelectTrigger data-testid={`select-item-${index}`}>
                                  <SelectValue placeholder="Select Item" />
                                </SelectTrigger>
                                <SelectContent>
                                  {inventoryItems?.map((inventoryItem: any) => (
                                    <SelectItem key={inventoryItem.id} value={inventoryItem.id}>
                                      {inventoryItem.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3 text-sm">{selectedItem?.hsn || '-'}</td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                className="w-20 text-right"
                                min="0.01"
                                step="0.01"
                                data-testid={`input-quantity-${index}`}
                              />
                            </td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(index, 'rate', e.target.value)}
                                className="w-24 text-right"
                                min="0"
                                step="0.01"
                                data-testid={`input-rate-${index}`}
                              />
                            </td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={item.taxRate}
                                onChange={(e) => updateItem(index, 'taxRate', e.target.value)}
                                className="w-20 text-right"
                                min="0"
                                max="100"
                                step="0.01"
                                data-testid={`input-tax-rate-${index}`}
                              />
                            </td>
                            <td className="p-3 text-right text-sm font-medium">
                              ₹{parseFloat(item.amount).toFixed(2)}
                            </td>
                            <td className="p-3 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                                disabled={items.length === 1}
                                data-testid={`button-remove-item-${index}`}
                              >
                                <i className="fas fa-trash text-destructive"></i>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full px-3 py-2 border border-border rounded-md resize-none"
                              rows={4}
                              placeholder="Additional notes..."
                              data-testid="textarea-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium" data-testid="text-subtotal">
                        ₹{totals.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CGST:</span>
                      <span className="font-medium" data-testid="text-cgst">
                        ₹{totals.cgst.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SGST:</span>
                      <span className="font-medium" data-testid="text-sgst">
                        ₹{totals.sgst.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-border pt-3">
                      <span>Total Amount:</span>
                      <span data-testid="text-total">₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 border-t border-border pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setItems([{ itemId: '', quantity: '1', rate: '0', taxRate: '18', amount: '0' }]);
                  }}
                  data-testid="button-reset"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={createInvoiceMutation.isPending}
                  data-testid="button-save-invoice"
                >
                  {createInvoiceMutation.isPending ? 'Saving...' : 'Save Invoice'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
