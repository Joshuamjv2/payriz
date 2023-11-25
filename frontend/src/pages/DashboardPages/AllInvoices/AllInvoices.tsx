import Sidebar from '../../../components/Sidebar/Sidebar';

const AllInvoices = () => {
  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-5 px-11 shadow-sm">
          <h2 className="text-blue font-bold">All Invoices</h2>
        </section>
      </div>
    </>
  );
};

export default AllInvoices;
