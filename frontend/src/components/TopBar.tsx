import { useContext } from 'react';
import { UserContextData } from '../context/type';
import { UserContext } from '../context/UserContext';
import search from '../assets/search.svg';
import alarm from '../assets/alarm.svg';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const user: UserContextData = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-blue font-bold text-xl">
        Welcome back, {user?.user?.firstName}{' '}
      </h1>

      <div className="flex items-center gap-5">
        <button type="button">
          <img src={search} alt="search" />
        </button>
        <button type="button" onClick={() => navigate('/dashboard/invoices')}>
          <img src={alarm} alt="notification" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
