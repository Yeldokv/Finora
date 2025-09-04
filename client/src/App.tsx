import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomersList from "./pages/CustomersList";
import CustomerForm from "./pages/CustomerForm";
import ItemsList from "./pages/ItemsList";
import ItemForm from "./pages/ItemForm";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-6">
          <Link to="/customers" className="text-blue-600">Customers</Link>
          <Link to="/items" className="text-blue-600">Items</Link>
        </nav>

        <Routes>
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/items/new" element={<ItemForm />} />
          <Route path="/" element={<h1 className="text-2xl font-bold">Welcome to Finora</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
