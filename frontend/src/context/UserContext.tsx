import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Props {
  children: ReactNode;
}

export const UserContext = createContext({});

// ... (existing imports)

const Context = ({ children }: Props) => {
  const [user, setUser] = useState({});
  const [_id, setUserId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true); // Add loading state

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

        setUser({ firstName, lastName, _id });
        setUserId(_id);
      } catch (error) {
        toast.error('Error fetching user');
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
      } catch (error) {
        toast.error('Error fetching customer profiles');
      }
    };

    fetchUser();
    fetchCustomers();
  }, [_id]);

  return (
    <UserContext.Provider value={{ user, customers, isProfileLoading }}>
      {Object.keys(user).length !== 0 ? children : null}
    </UserContext.Provider>
  );
};

export default Context;
