import Sidebar from '../../../components/Sidebar/Sidebar';
import withdraw from '../../../assets/withdraw.svg';
import AddBankDetails from './AddBankDetails';
import { useState } from 'react';

const Wallet = () => {
  const [bankDetailsModalIsOpen, setBankDetailsModalIsOpen] = useState(false);

  function closeBankModal() {
    setBankDetailsModalIsOpen(false);
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-10 px-11 shadow-sm">
          <div className="flex items-center justify-between bg-blue bg-opacity-25 rounded-lg p-7 shadow-sm">
            <div>
              <h1 className="font-bold text-4xl">₦250,000</h1>
              <p className="font-light">Current Wallet Balance</p>
            </div>
            <button
              type="button"
              className="bg-blue text-white flex items-center rounded-lg p-3 gap-3"
            >
              <img src={withdraw} alt="withdraw" />
              Withdraw
            </button>
          </div>

          <div className="mt-10">
            <div className="flex justify-between items-center">
              <h2 className="text-blue font-bold">All Transaction Details</h2>
              <button
                className="text-gray text-sm font-light pt-2"
                type="button"
                onClick={() => setBankDetailsModalIsOpen(true)}
              >
                Click here to add bank details
              </button>
            </div>
          </div>

          <table className="mt-5 w-full overflow-x-auto block [&::-webkit-scrollbar]:hidden">
            <tbody className="table w-full">
              <tr className="[&>*]:text-left [&>*]:py-3 text-gray text-sm bg-blue bg-opacity-25">
                <th>Paid by</th>
                <th>Amount</th>
                <th className="">Date Paid</th>
              </tr>

              {/* {user?.customers?.map((customer) => (
                <tr key={customer.id} className="[&>*]:p-2 text-sm">
                  <td className="flex items-center gap-x-2 whitespace-nowrap">
                    <img
                      src={person}
                      alt="person"
                      className="sm:block hidden"
                    />
                    {customer.name}
                  </td>
                  <td>{customer.email}</td>
                  <td className="">
                    {convertTimestampToFormattedDate(customer.created)}
                  </td>
                  <td className="flex sm:gap-6 gap-3 items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteOpening(customer.id)}
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="w-3 max-w-[12px] block sm:mb-4"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewOpening(customer.id)}
                    >
                      <img
                        src={eyeIcon}
                        alt="View"
                        className="w-3 max-w-[12px] block sm:mb-4"
                      />
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </section>

        <AddBankDetails
          modalIsOpen={bankDetailsModalIsOpen}
          closeModal={closeBankModal}
        />
      </div>
    </>
  );
};

export default Wallet;
