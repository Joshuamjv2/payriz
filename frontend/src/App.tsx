import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './pages/AuthPages/Login';
import Register from './pages/AuthPages/Register';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './hooks/ProtectedRoute';
import AuthRoute from './hooks/AuthRoute';
import Cookies from 'js-cookie';
import CreateProfile from './pages/DashboardPages/CreateProfile';
import Profiles from './pages/DashboardPages/Profiles/Profiles';
import AttachInvoice from './pages/DashboardPages/AttachInvoice';
import AllInvoices from './pages/DashboardPages/AllInvoices';
import Wallet from './pages/DashboardPages/Wallet';

function App() {
  const isAuthenticated = !!Cookies.get('token');

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route path="" element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create-profile" element={<CreateProfile />} />
          <Route path="/dashboard/profiles" element={<Profiles />} />
          <Route path="/dashboard/attach-invoice" element={<AttachInvoice />} />
          <Route path="/dashboard/invoices" element={<AllInvoices />} />
          <Route path="/dashboard/wallet" element={<Wallet />} />
        </Route>
        <Route path="" element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
