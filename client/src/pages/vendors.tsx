import Layout from '@/components/Layout';

export default function VendorsPage() {
  return (
    <Layout>
      <header className="bg-card border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Vendors</h2>
          <p className="text-sm text-muted-foreground">Manage vendor information and supplier details</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="text-center py-12">
          <i className="fas fa-truck text-6xl text-muted-foreground mb-4"></i>
          <h3 className="text-lg font-semibold text-foreground mb-2">Vendors Module</h3>
          <p className="text-muted-foreground">Vendor management functionality will be implemented here</p>
        </div>
      </main>
    </Layout>
  );
}
