import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import Context from '../context/UserContext';

const ProtectedRoute = () => {
  const isAuthenticated = !!Cookies.get('token');

  return isAuthenticated ? (
    <Context>
      <Outlet />
    </Context>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
