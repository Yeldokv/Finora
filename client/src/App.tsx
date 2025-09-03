import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import SalesPage from "@/pages/sales";
import PurchasePage from "@/pages/purchase";
import LedgerPage from "@/pages/ledger";
import ReportsPage from "@/pages/reports";
import InventoryPage from "@/pages/inventory";
import CustomersPage from "@/pages/customers";
import VendorsPage from "@/pages/vendors";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/sales" component={SalesPage} />
      <Route path="/purchase" component={PurchasePage} />
      <Route path="/ledger" component={LedgerPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/inventory" component={InventoryPage} />
      <Route path="/customers" component={CustomersPage} />
      <Route path="/vendors" component={VendorsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
