import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: recentInvoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['/api/invoices'],
  });

  const { data: lowStockItems, isLoading: stockLoading } = useQuery({
    queryKey: ['/api/items/low-stock'],
  });

  if (statsLoading || invoicesLoading || stockLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button data-testid="button-backup-data">
            <i className="fas fa-download mr-2"></i>
            Backup Data
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <i className="fas fa-cog"></i>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-sales">
                    {formatCurrency(stats?.totalSales || 0)}
                  </p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    +12.5% from last month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <i className="fas fa-chart-line text-primary"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-outstanding">
                    {formatCurrency(stats?.outstanding || 0)}
                  </p>
                  <p className="text-xs text-warning flex items-center mt-1">
                    <i className="fas fa-clock mr-1"></i>
                    {stats?.pendingInvoicesCount || 0} pending invoices
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Purchase</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-purchase">
                    {formatCurrency(stats?.totalPurchases || 0)}
                  </p>
                  <p className="text-xs text-destructive flex items-center mt-1">
                    <i className="fas fa-arrow-down mr-1"></i>
                    -3.2% from last month
                  </p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-full">
                  <i className="fas fa-shopping-cart text-destructive"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-net-profit">
                    {formatCurrency(stats?.netProfit || 0)}
                  </p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    +8.7% from last month
                  </p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <i className="fas fa-coins text-success"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/sales">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    data-testid="button-create-invoice"
                  >
                    <i className="fas fa-file-invoice text-primary mr-3"></i>
                    <div className="text-left">
                      <p className="font-medium">Create Invoice</p>
                      <p className="text-xs text-muted-foreground">Generate new sales invoice</p>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/purchase">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    data-testid="button-record-purchase"
                  >
                    <i className="fas fa-shopping-cart text-primary mr-3"></i>
                    <div className="text-left">
                      <p className="font-medium">Record Purchase</p>
                      <p className="text-xs text-muted-foreground">Add new purchase entry</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/ledger">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    data-testid="button-ledger-entry"
                  >
                    <i className="fas fa-book text-primary mr-3"></i>
                    <div className="text-left">
                      <p className="font-medium">Ledger Entry</p>
                      <p className="text-xs text-muted-foreground">Make journal entry</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/reports">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    data-testid="button-view-reports"
                  >
                    <i className="fas fa-chart-bar text-primary mr-3"></i>
                    <div className="text-left">
                      <p className="font-medium">View Reports</p>
                      <p className="text-xs text-muted-foreground">Generate financial reports</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Invoices</h3>
                <Link href="/sales">
                  <Button variant="link" size="sm" data-testid="link-view-all-invoices">
                    View All
                  </Button>
                </Link>
              </div>
              
              {recentInvoices?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <i className="fas fa-file-invoice text-4xl mb-4"></i>
                  <p>No invoices created yet</p>
                  <Link href="/sales">
                    <Button className="mt-4" data-testid="button-create-first-invoice">
                      Create Your First Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Invoice #</th>
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-2 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-right py-2 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-center py-2 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices?.slice(0, 5).map((invoice: any) => (
                        <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 text-sm font-medium text-foreground">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="py-3 text-sm text-foreground">
                            {invoice.customer?.name || 'Unknown Customer'}
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-sm text-right font-medium text-foreground">
                            {formatCurrency(invoice.totalAmount)}
                          </td>
                          <td className="py-3 text-center">
                            <Badge
                              variant={invoice.status === 'PAID' ? 'default' : 'secondary'}
                              className={
                                invoice.status === 'PAID' 
                                  ? 'bg-success/10 text-success' 
                                  : 'bg-warning/10 text-warning'
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems && lowStockItems.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Low Stock Alerts</h3>
                <Link href="/inventory">
                  <Button variant="link" size="sm" data-testid="link-manage-inventory">
                    Manage Inventory
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockItems.slice(0, 6).map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 border border-destructive/20 bg-destructive/5 rounded-md"
                    data-testid={`low-stock-item-${item.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">HSN: {item.hsn || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-destructive">
                          {parseFloat(item.currentStock || '0').toFixed(0)} units
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Min: {parseFloat(item.minimumStock || '0').toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
