import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import InvoiceNav from './InvoiceNav';

const InvoiceLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-5 sm:px-11 px-5 shadow-sm">
          <h2 className="text-blue font-bold">All Invoices</h2>
          <InvoiceNav />
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default InvoiceLayout;
