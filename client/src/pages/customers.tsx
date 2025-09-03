import Layout from '@/components/Layout';

export default function CustomersPage() {
  return (
    <Layout>
      <header className="bg-card border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Customers</h2>
          <p className="text-sm text-muted-foreground">Manage customer information and contacts</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="text-center py-12">
          <i className="fas fa-users text-6xl text-muted-foreground mb-4"></i>
          <h3 className="text-lg font-semibold text-foreground mb-2">Customers Module</h3>
          <p className="text-muted-foreground">Customer management functionality will be implemented here</p>
        </div>
      </main>
    </Layout>
  );
}
