import Sidebar from '../../../components/Sidebar/Sidebar';
import withdraw from '../../../assets/withdraw.svg';
import AddBankDetails from './AddBankDetails';
import { useState, useEffect, useContext } from 'react';
import WithdrawModal from './WithdrawModal';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';
import { convertTimestampToFormattedDate } from '../../../helpers';

const Wallet = () => {
  const user: UserContextData = useContext(UserContext);
  const [bankDetailsModalIsOpen, setBankDetailsModalIsOpen] = useState(false);
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
  const [storedWallet, setStoredWallet] = useState<any>({});
  const [isWalletLoading, setIsWalletLoading] = useState(true);

  function closeBankModal() {
    setBankDetailsModalIsOpen(false);
  }

  function closeWithdrawModal() {
    setWithdrawModalIsOpen(false);
  }

  useEffect(() => {
    const fetchWallets = async () => {
      setIsWalletLoading(true);
      try {
        const res = await axios.get(`/wallets?owner=${user?.user!._id}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        const resBody = JSON.parse(res.data.body);

        const uniqueWallet = resBody?.find(
          (item: { owner: string }) => item.owner === user?.user!._id,
        );
        setStoredWallet(uniqueWallet);
        setIsWalletLoading(false);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching wallet');
      }
    };

    fetchWallets();
  }, [user?.user]);

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-10 sm:px-11 px-2 shadow-sm">
          <div className="sm:flex items-center justify-between bg-blue bg-opacity-25 rounded-lg p-7 shadow-sm">
            <div>
              <h1 className="font-bold sm:text-4xl text-2xl">
                ₦{storedWallet?.balance}
              </h1>
              <p className="font-light sm:text-sm text-xs">
                Current Wallet Balance
              </p>
            </div>
            <button
              type="button"
              className="bg-blue sm:mt-0 mt-3 text-white sm:text-base text-sm flex items-center rounded-lg p-3 gap-3"
              onClick={() => setWithdrawModalIsOpen(true)}
            >
              <img src={withdraw} alt="withdraw" />
              Withdraw Funds
            </button>
          </div>

          <div className="mt-10">
            <div className="flex justify-between gap-3 items-center">
              <h2 className="text-blue font-bold">All Transaction Details</h2>
              <button
                className="text-gray text-sm font-light pt-2 text-end"
                type="button"
                onClick={() => setBankDetailsModalIsOpen(true)}
              >
                Click here to add bank details
              </button>
            </div>
          </div>

          <table className="mt-5 w-full overflow-x-auto block [&::-webkit-scrollbar]:hidden">
            <tbody className="table w-full">
              <tr className="[&>*]:text-left [&>*]:py-3 text-gray text-sm ">
                <th>Description</th>
                <th>Amount (in Naira)</th>
                <th>Type</th>
                <th className="flex justify-end">Date</th>
              </tr>

              {storedWallet?.history?.map(
                (
                  transaction: {
                    total: any;
                    description: any;
                    type: any;
                    paid_at: any;
                  },
                  index: any,
                ) => (
                  <tr
                    key={`${transaction.description} ${index}`}
                    className="[&>*]:p-2 text-sm"
                  >
                    <td className="flex items-center gap-x-2">
                      {transaction.description}
                    </td>
                    <td>{transaction.total}</td>
                    <td className="">{transaction.type}</td>
                    <td className="flex sm:gap-6 gap-3 items-center justify-end">
                      {convertTimestampToFormattedDate(transaction?.paid_at)}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          {isWalletLoading && (
            <p className="text-center sm:my-40 my-10 text-gray text-sm">
              Loading...
            </p>
          )}
        </section>

        <AddBankDetails
          modalIsOpen={bankDetailsModalIsOpen}
          closeModal={closeBankModal}
        />
        <WithdrawModal
          modalIsOpen={withdrawModalIsOpen}
          closeModal={closeWithdrawModal}
          storedWallet={storedWallet}
        />
      </div>
    </>
  );
};

export default Wallet;
