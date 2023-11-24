import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRoute = () => {
  const isAuthenticated = !!Cookies.get('token');

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthRoute;
