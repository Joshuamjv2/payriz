import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/AuthPages/Login';
import Register from './pages/AuthPages/Register';
import ForgotPassword from './pages/AuthPages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './hooks/ProtectedRoute';
import AuthRoute from './hooks/AuthRoute';
import CreateProfile from './pages/DashboardPages/CreateProfile';
import Profiles from './pages/DashboardPages/Profiles/Profiles';
import AttachInvoice from './pages/DashboardPages/AttachInvoice/AttachInvoice';
import Wallet from './pages/DashboardPages/Wallet/Wallet';
import SendInvoice from './pages/DashboardPages/AttachInvoice/SendInvoice';
import PaymentStatus from './pages/PublicPages/PaymentStatus';
import InvoiceLayout from './pages/DashboardPages/AllInvoices/InvoiceLayout';
import OverdueInvoices from './pages/DashboardPages/AllInvoices/OverdueInvoices';
import PendingInvoices from './pages/DashboardPages/AllInvoices/PendingInvoices';
import PaidInvoices from './pages/DashboardPages/AllInvoices/PaidInvoices';
import LandingPage from './pages/LandingPage/LandingPage';
import PublicRoute from './hooks/PublicRoute';
import ResetPassword from './pages/AuthPages/ResetPassword';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/payment-status" element={<PaymentStatus />} />

        <Route path="" element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="" element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create-profile" element={<CreateProfile />} />
          <Route path="/dashboard/profiles" element={<Profiles />} />
          <Route path="/dashboard/attach-invoice" element={<AttachInvoice />} />
          <Route
            path="/dashboard/attach-invoice/send"
            element={<SendInvoice />}
          />

          <Route path="/dashboard/invoices" element={<InvoiceLayout />}>
            <Route path="/dashboard/invoices" element={<OverdueInvoices />} />
            <Route path="pending" element={<PendingInvoices />} />
            <Route path="paid" element={<PaidInvoices />} />
          </Route>
          <Route path="/dashboard/wallet" element={<Wallet />} />
        </Route>
        <Route path="" element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
