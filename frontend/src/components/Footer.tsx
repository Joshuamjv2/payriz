import { Link } from 'react-router-dom';
import facebook from '../assets/landing_page/facebook.svg';
import google from '../assets/landing_page/google.svg';
import pinterest from '../assets/landing_page/pinterest.svg';
import twitter from '../assets/landing_page/twitter.svg';
import logo from '../assets/logo.svg';

const Footer = () => {
  const companyLinks = [
    { name: 'About us', href: '/' },
    { name: 'Careers', href: '/' },
    { name: 'Press', href: '/' },
    { name: 'News', href: '/' },
    { name: 'Media kit', href: '/' },
    { name: 'Contact', href: '/' },
  ];

  const resourceLinks = [
    { name: 'Blog', href: '/' },
    { name: 'Newsletter', href: '/' },
    { name: 'Events', href: '/' },
    { name: 'Help Centre', href: '/' },
    { name: 'Media kit', href: '/' },
    { name: 'Contact', href: '/' },
  ];

  return (
    <footer className="bg-blue mt-16 py-9 text-white">
      <div className="grid grid-cols-3">
        <div className="mx-auto">
          <h2>Company</h2>
          <div className="flex flex-col">
            {companyLinks.map((link) => (
              <Link key={link.name} to={link.href}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto mb-3 sm:mb-0">
          <h2>Resources</h2>
          <div className="flex flex-col">
            {resourceLinks.map((link) => (
              <Link key={link.name} to={link.href}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex [&>*]:w-6 items-center sm:col-span-1 col-span-2 gap-4 mx-auto mt-auto">
          <img src={facebook} alt="facebook" />
          <img src={twitter} alt="twitter" />
          <img src={pinterest} alt="pinterest" />
          <img src={google} alt="mail" />
        </div>
      </div>

      <hr className="border-t-[#EAECF0] mt-9" />
      <div className="flex flex-wrap justify-between items-center mt-8 lg:mx-32 mx-8">
        <div className="flex items-center gap-x-4 sm:mx-0 mx-auto">
          <img src={logo} alt="logo" className="w-8" />
          <p>Payriz</p>
        </div>
        <p className="sm:text-left w-full sm:w-fit text-center text-sm sm:text-base whitespace-nowrap">
          © 2023 Payriz. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
