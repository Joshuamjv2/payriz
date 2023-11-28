import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import Context from '../context/UserContext';

const PublicRoute = () => {
  const isAuthenticated = !!Cookies.get('token');

  return isAuthenticated ? (
    <Context>
      <Outlet />
    </Context>
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
