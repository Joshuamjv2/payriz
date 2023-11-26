// import axios from 'axios';
import { useContext } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import TopBar from '../components/TopBar';
import create_white from '../assets/create-white.svg';
import attach_white from '../assets/attach-white.svg';
import { useNavigate } from 'react-router-dom';
import { UserContextData } from '../context/type';
import { UserContext } from '../context/UserContext';
import {
  calculateTotalAmount,
  convertTimestampToFormattedDate,
} from '../helpers';
import person from '../assets/person.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const user: UserContextData = useContext(UserContext);

  console.log(user);

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <TopBar />
        <p className="text-gray text-sm font-light pt-2">
          Take a look at your financial overview
        </p>

        <section className="grid xl:grid-cols-2 mt-5 gap-5">
          <section>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg py-5 px-11 shadow-sm">
                <h2 className="text-blue font-bold">Create a Profile</h2>
                <p className="text-gray text-sm font-light pt-2">
                  Click here to create a profile
                </p>
                <button
                  type="button"
                  className="flex gap-1 items-center bg-blue rounded-md px-5 py-2 text-white mt-5"
                  onClick={() => navigate('/dashboard/create-profile')}
                >
                  <img src={create_white} alt="create" />
                  Create Profile
                </button>
              </div>
              <div className="bg-white rounded-lg py-5 px-11 shadow-sm">
                <h2 className="text-blue font-bold">Attach Invoice</h2>
                <p className="text-gray text-sm font-light pt-2">
                  Click here to attach an invoice
                </p>
                <button
                  type="button"
                  className="flex gap-1 items-center bg-blue rounded-md px-5 py-2 text-white mt-5"
                  onClick={() => navigate('/dashboard/attach-invoice')}
                >
                  <img src={attach_white} alt="create" />
                  Attach Invoice
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg py-5 px-11 mt-5 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-blue font-bold">Invoices</h2>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/invoices')}
                  className="text-gray text-sm font-light pt-2"
                >
                  View All...
                </button>
              </div>

              <table className="mt-5 w-full">
                <tbody>
                  <tr className="[&>*]:text-left text-gray text-sm">
                    <th>Invoice #</th>
                    <th>Amount</th>
                    <th className="flex justify-end">Date Created</th>
                  </tr>

                  {user?.invoices?.slice(0, 5).map((invoice) => (
                    <tr key={invoice.id} className="[&>*]:py-5 text-sm">
                      <td>{invoice.invoice_number}</td>
                      <td>{calculateTotalAmount(invoice.items)}</td>
                      <td className="flex justify-end">{invoice.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {user?.isInvoiceLoading && user?.invoices?.length === 0 && (
                <p className="text-center sm:my-40 my-10 text-gray text-sm">
                  Loading...
                </p>
              )}

              {user?.invoices?.length == 0 && !user?.isInvoiceLoading && (
                <p className="text-center sm:my-40 my-10 text-gray text-sm">
                  No invoices yet
                </p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg py-5 px-11 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-blue font-bold">List of Profiles</h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/profiles')}
                className="text-gray text-sm font-light pt-2"
              >
                View All...
              </button>
            </div>

            <table className="mt-5 w-full overflow-x-auto">
              <tbody>
                <tr className="[&>*]:text-left text-gray text-sm">
                  <th>Name</th>
                  <th>Contact Information</th>
                  <th className="flex justify-end">Date Created</th>
                </tr>
                {user?.customers?.slice(0, 8).map((customer) => (
                  <tr key={customer.id} className="[&>*]:py-2 text-sm">
                    <td className="flex items-center gap-x-2">
                      <img
                        src={person}
                        alt="person"
                        className="sm:block hidden"
                      />
                      {customer.name}
                    </td>
                    <td>{customer.email}</td>
                    <td className="flex justify-end">
                      {convertTimestampToFormattedDate(customer.created)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {user?.isProfileLoading && user?.customers?.length === 0 && (
              <p className="text-center sm:my-40 my-10 text-gray text-sm">
                Loading...
              </p>
            )}

            {user?.customers?.length == 0 && !user?.isProfileLoading && (
              <p className="text-center sm:my-40 my-10 text-gray text-sm">
                No profiles created yet
              </p>
            )}
          </section>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
