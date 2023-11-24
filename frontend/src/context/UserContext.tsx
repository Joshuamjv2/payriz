import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface Props {
  children: ReactNode;
}

export const UserContext = createContext({});

const Context = ({ children }: Props) => {
  const [user, setUser] = useState({});

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

        setUser({ firstName, lastName });
      } catch (error) {
        // Handle error, e.g., set user to null or show an error message
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <UserContext.Provider value={{ user }}>
      {Object.keys(user).length !== 0 ? children : null}
    </UserContext.Provider>
  );
};

export default Context;
