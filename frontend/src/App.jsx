import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ShopEaseAuth from "./Login/Signin";
import DashboardLayout from "./layouts/DashboardLayout";
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Accounts from "./pages/Accounts";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import CompanySettings from "./pages/CompanySettings";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Vendors from "./pages/Vendors";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<ShopEaseAuth />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route
            path="/company-settings"
            element={<CompanySettings />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/change-password"
            element={<ChangePassword />}
          />
        </Route>

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;