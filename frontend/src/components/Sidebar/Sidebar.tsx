import home from '../../assets/home.svg';
import create from '../../assets/create.svg';
import list from '../../assets/list.svg';
import attach from '../../assets/attach.svg';
import view from '../../assets/view.svg';
import wallet from '../../assets/wallet.svg';
import { useEffect, useState } from 'react';
import Hamburger from './Hamburger';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import logout from '../../assets/logout.svg';
import profile_pic from '../../assets/profile-pic.svg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { UserContextData } from '../../context/type';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();
  const user: UserContextData = useContext(UserContext);

  useEffect(() => {
    setOpenDrawer(false);
  }, [location.pathname]);

  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove('token');
    Cookies.remove('refresh-token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const sidebarOptions = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: home,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Create a Profile',
      href: '/dashboard/create-profile',
      icon: create,
      current: location.pathname === '/dashboard/create-profile',
    },
    {
      name: 'List of Profiles',
      href: '/dashboard/profiles',
      icon: list,
      current: location.pathname === '/dashboard/profiles',
    },
    {
      name: 'Attach Invoice',
      href: '/dashboard/attach-invoice',
      icon: attach,
      current: location.pathname === '/dashboard/attach-invoice',
    },
    {
      name: 'All Invoices',
      href: '/dashboard/invoices',
      icon: view,
      current: location.pathname === '/dashboard/invoices',
    },
    {
      name: 'Wallet',
      href: '/dashboard/wallet',
      icon: wallet,
      current: location.pathname === '/dashboard/wallet',
    },
  ];
  const divStyle = {
    background:
      'linear-gradient(180deg, rgba(0, 117, 255, 0.85) 0%, rgba(245, 245, 245, 1) 100%)',
  };

  const drawer = (
    <div
      className="flex grow flex-col overflow-y-auto shadow-md pl-4 pr-7 h-screen [&::-webkit-scrollbar]:hidden"
      style={divStyle}
    >
      <img src={logo} alt="Logo" className="w-[50px] mx-auto mt-5" />
      <div className="flex flex-col justify-center items-center mt-7">
        <img src={profile_pic} alt="Profile Picture" className="w-[50px]" />
        <p className="pt-2 font-bold text-sm">
          {user?.user?.firstName} {user?.user?.lastName}
        </p>
        <button disabled className="mt-1 text-xs font-semibold text-white">
          Edit profile
        </button>
      </div>
      <nav className="flex flex-1 flex-col mt-10">
        <ul role="list" className="flex flex-1 flex-col">
          <li>
            <ul role="list" className="-mx-2 space-y-5">
              {sidebarOptions.map((option) => (
                <li key={option.name}>
                  <Link
                    to={option.href}
                    className={classNames(
                      option.current
                        ? 'bg-white font-bold border-l-4 border-l-blue'
                        : 'text-black font-normal hover:text-black hover:bg-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    )}
                  >
                    <img src={option.icon} alt="icon" />
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      <button
        className="lg:pb-3 pb-16 flex gap-2 text-black items-center text-sm"
        onClick={handleLogOut}
      >
        <img src={logout} alt="logout" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="z-20 ">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[186px] lg:flex-col">
        {drawer}
      </div>
      <div className={`bg-white block lg:hidden fixed left-0 z-50`}>
        <Hamburger openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        <div className={openDrawer ? 'mt-2 drop-shadow-2xl' : ''}>
          {openDrawer && <div className="fixed w-[186px]">{drawer}</div>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
