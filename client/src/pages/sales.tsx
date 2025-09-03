import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import InvoiceForm from '@/components/InvoiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SalesPage() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['/api/invoices'],
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/invoices/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete invoice',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice? Only the last invoice can be deleted.')) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sales & Billing</h2>
          <p className="text-sm text-muted-foreground">Manage invoices and sales transactions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-invoice">
                <i className="fas fa-plus mr-2"></i>
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <InvoiceForm />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : invoices?.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-file-invoice text-6xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold text-foreground mb-2">No invoices yet</h3>
                <p className="text-muted-foreground mb-6">Create your first invoice to get started</p>
                <Button onClick={() => setShowForm(true)} data-testid="button-create-first-invoice">
                  <i className="fas fa-plus mr-2"></i>
                  Create Invoice
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Invoice #</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Due Date</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices?.map((invoice: any, index: number) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-border hover:bg-muted/50"
                        data-testid={`invoice-row-${invoice.id}`}
                      >
                        <td className="py-4 text-sm font-medium text-foreground">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="py-4 text-sm text-foreground">
                          {invoice.customer?.name || 'Unknown Customer'}
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                        </td>
                        <td className="py-4 text-sm text-right font-medium text-foreground">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="py-4 text-center">
                          <Badge
                            variant={invoice.status === 'PAID' ? 'default' : 'secondary'}
                            className={
                              invoice.status === 'PAID'
                                ? 'bg-success/10 text-success'
                                : invoice.status === 'PENDING'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-destructive/10 text-destructive'
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-view-invoice-${invoice.id}`}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-print-invoice-${invoice.id}`}
                            >
                              <i className="fas fa-print"></i>
                            </Button>
                            {index === 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(invoice.id)}
                                disabled={deleteInvoiceMutation.isPending}
                                data-testid={`button-delete-invoice-${invoice.id}`}
                              >
                                <i className="fas fa-trash text-destructive"></i>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
}
