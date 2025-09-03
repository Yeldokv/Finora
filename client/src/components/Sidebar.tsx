import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'fas fa-tachometer-alt' },
  { name: 'Sales & Billing', href: '/sales', icon: 'fas fa-file-invoice' },
  { name: 'Purchase', href: '/purchase', icon: 'fas fa-shopping-cart' },
  { name: 'Ledger', href: '/ledger', icon: 'fas fa-book' },
  { name: 'Reports', href: '/reports', icon: 'fas fa-chart-bar' },
  { name: 'Inventory', href: '/inventory', icon: 'fas fa-boxes' },
  { name: 'Customers', href: '/customers', icon: 'fas fa-users' },
  { name: 'Vendors', href: '/vendors', icon: 'fas fa-truck' },
];

export default function Sidebar() {
  const [location] = useLocation();

  const { data: financialYears } = useQuery({
    queryKey: ['/api/financial-years'],
  });

  const { data: activeYear } = useQuery({
    queryKey: ['/api/financial-years/active'],
  });

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* App Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">AccountingPro</h1>
        <p className="text-sm text-muted-foreground">Offline Accounting System</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1" data-testid="sidebar-navigation">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  'nav-item flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <i className={`${item.icon} mr-3 w-4`}></i>
                {item.name}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Financial Year Selector */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Financial Year
          </label>
          <Select value={activeYear?.id || ''} data-testid="financial-year-select">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Financial Year" />
            </SelectTrigger>
            <SelectContent>
              {financialYears?.map((fy: any) => (
                <SelectItem key={fy.id} value={fy.id}>
                  {fy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          data-testid="button-new-financial-year"
        >
          <i className="fas fa-plus mr-2"></i>
          New Financial Year
        </Button>
      </div>
    </div>
  );
}
