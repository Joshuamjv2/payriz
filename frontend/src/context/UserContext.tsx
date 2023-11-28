import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export const UserContext = createContext({});

const Context = ({ children }: Props) => {
  const [user, setUser] = useState({});
  const [_id, setUserId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/me`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        const resBody = JSON.parse(res.data.body);
        const firstName = resBody.first_name;
        const lastName = resBody.last_name;
        const _id = resBody._id;
        const businessName = resBody.business_name;

        setUser({ firstName, lastName, _id, businessName });
        setUserId(_id);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching user');
      }
    };

    const fetchCustomers = async () => {
      setIsProfileLoading(true);
      try {
        if (_id) {
          const res = await axios.get(`/customers?owner_id=${_id}`, {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            },
          });

          const resBody = JSON.parse(res.data.body);
          setCustomers(resBody);
        }
        setIsProfileLoading(false);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching customer profiles');
      }
    };

    const fetchInvoices = async () => {
      setIsInvoiceLoading(true);
      try {
        if (_id) {
          const res = await axios.get(`/invoices?owner_id=${_id}`, {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`,
            },
          });

          const resBody = JSON.parse(res.data.body);
          setInvoices(resBody);
        }
        setIsInvoiceLoading(false);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching invoices');
      }
    };

    fetchUser();
    fetchCustomers();
    fetchInvoices();
  }, [_id, location.pathname]);

  return (
    <UserContext.Provider
      value={{ user, customers, isProfileLoading, invoices, isInvoiceLoading }}
    >
      {/* {Object.keys(user).length !== 0 ? children : <LoadingSpinner />} */}
      {children}
    </UserContext.Provider>
  );
};

export default Context;
