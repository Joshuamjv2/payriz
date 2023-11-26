import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const InvoiceNav = () => {
  const [isActiveL, setIsActiveL] = useState(false);
  const navLinks = [
    { name: 'Overdue', route: '/', homeRoute: true },
    { name: 'Pending', route: '/pending' },
    { name: 'Paid', route: '/paid' },
  ];
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === '/dashboard/invoices' ||
      location.pathname === '/dashboard/invoices/'
    ) {
      setIsActiveL(true);
    } else {
      setIsActiveL(false);
    }
  }, [location]);

  return (
    <div>
      <nav className="mx-5 sm-sc:mx-2 pt-5 flex sm:gap-x-11 gap-x-5 sm-sc:gap-x-1 overflow-x-scroll [&::-webkit-scrollbar]:hidden pb-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={`/dashboard/invoices${link.route}`}
            className={`${
              (isActiveL && link.homeRoute) ||
              (!link.homeRoute &&
                location.pathname === `/dashboard/invoices${link.route}`)
                ? 'text-white rounded-lg font-semibold p-[10px] bg-blue text-sm'
                : 'text-gray text-sm p-[10px]'
            }`}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default InvoiceNav;
