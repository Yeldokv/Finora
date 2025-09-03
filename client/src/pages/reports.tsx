import Layout from '@/components/Layout';

export default function ReportsPage() {
  return (
    <Layout>
      <header className="bg-card border-b border-border px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Reports</h2>
          <p className="text-sm text-muted-foreground">Generate financial reports and statements</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        <div className="text-center py-12">
          <i className="fas fa-chart-bar text-6xl text-muted-foreground mb-4"></i>
          <h3 className="text-lg font-semibold text-foreground mb-2">Reports Module</h3>
          <p className="text-muted-foreground">Reports functionality will be implemented here</p>
        </div>
      </main>
    </Layout>
  );
}
