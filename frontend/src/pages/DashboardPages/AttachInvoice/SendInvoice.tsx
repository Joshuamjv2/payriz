import { useNavigate } from 'react-router-dom';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import person from '../../../assets/person.svg';
import ReadOnlyCalendar from '../../../components/ReadOnlyCalendar';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';
import { useContext, useState } from 'react';
import {
  calculateTotal,
  formatShortDate,
  transformProducts,
} from '../../../helpers';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const SendInvoice = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const invoiceValues = state?.values;
  const invoiceCustomer = state?.chosenCustomer;

  const user: UserContextData = useContext(UserContext);

  if (!state) {
    return <Navigate to="/dashboard/attach-invoice" />;
  }

  const customer = user?.customers?.find(
    (customer) => customer.id === state?.chosenCustomer,
  );

  const invoicePayLoad = {
    customer: {
      customer_id: customer?.id,
      name: customer?.name,
      email: customer?.email,
    },
    invoice_number: state?.values?.invoiceNumber,
    owner: {
      owner_id: user?.user?._id,
      name: `${user?.user?.firstName} ${user?.user?.lastName}`,
    },
    due_date: formatShortDate(state?.values?.dueDate),
    invoice_date: formatShortDate(state?.values?.issueDate),
    items: transformProducts(state?.values?.products),
    redirect_url: `${import.meta.env.VITE_FRONTEND_URL}/payment-status`,
  };

  const handleEdit = () => {
    navigate('/dashboard/attach-invoice', {
      state: { invoiceValues, invoiceCustomer },
    });
  };

  const sendInvoice = async () => {
    //
    // console.log(state?.values);
    // console.log(customer);

    console.log(invoicePayLoad);

    setIsButtonDisabled(true);
    try {
      await axios.post(`/invoices`, invoicePayLoad, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });
      navigate('/dashboard');
      toast.success('Invoice sent successfully');

      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        {/* <p className="text-gray text-sm font-light pt-2">
          Take a look at your financial overview
        </p> */}

        <section className="grid xl:grid-cols-3 mt-5 gap-5">
          <section className="bg-white xl:col-span-2 rounded-lg py-5 sm:px-11 px-5 shadow-sm">
            <h2 className="text-blue font-bold">
              Invoice #{state?.values?.invoiceNumber}
            </h2>
            <div className="bg-blue bg-opacity-25 rounded-lg mt-7 py-3 px-5 flex justify-between">
              <div>
                <h2 className="font-bold text-[13px]">Invoice Number</h2>
                <div className="mt-3 text-xs font-light">
                  <p>{state?.values?.invoiceNumber}</p>
                  <p>Issued Date: {state?.values?.issueDate}</p>
                  <p>Due Date: {state?.values?.dueDate}</p>
                </div>
              </div>
              <div className="text-end ">
                <h2 className="font-bold text-[13px]">Bill to</h2>
                <div className="mt-3 text-xs font-light">
                  <p>{state?.values?.customerName}</p>
                  <p>{customer?.email}</p>
                  <p>{customer?.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-bold text-[13px]">Item Details</h2>
              <p className="text-xs font-light">
                Item description and information
              </p>
              <table className="mt-6 w-full overflow-x-auto">
                <tbody className="">
                  <tr className="[&>*]:text-left text-gray text-sm">
                    <th>ITEM</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th className="flex justify-end">Amount</th>
                  </tr>
                  {state?.values?.products?.map((item: any, index: string) => (
                    <tr
                      className="[&>*]:py-1 text-xs"
                      key={`${item.productName} ${index}`}
                    >
                      <td>{item.productName}</td>
                      <td>{item.productQuantity.toFixed(2)}</td>
                      <td>{item.productAmount.toFixed(2)}</td>
                      <td className="flex justify-end">
                        {(item.productQuantity * item.productAmount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-5 flex justify-end">
                <div className="flex gap-20 font-semibold text-xs border-t-[1px] border-t-gray pt-2">
                  <p>Total</p>
                  <p>{calculateTotal(state?.values?.products)}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-lg py-5 sm:px-11 px-5 shadow-sm">
              <h2 className="text-blue font-bold">Client Details</h2>
              <div className="flex gap-2 items-center mt-4">
                <img src={person} alt="person" />
                <div>
                  <h3>{state?.values?.customerName}</h3>
                  <p className="text-xs font-light">{customer?.email}</p>
                  <address className="not-italic">{customer?.address}</address>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg py-5 sm:px-11 px-5 shadow-sm mt-10">
              <h2 className="text-blue font-bold">Basic Info</h2>
              <div className=" items-center mt-4">
                <ReadOnlyCalendar
                  label="Invoice Date"
                  name="invoiceDate"
                  value={state?.values?.issueDate}
                />
                <ReadOnlyCalendar
                  label="Due Date"
                  name="dueDate"
                  value={state?.values?.dueDate}
                />
              </div>

              <div className="gap-4 grid grid-cols-2">
                <button
                  onClick={handleEdit}
                  type="submit"
                  className="mt-6 disabled:bg-gray py-[10px] justify-center flex border-[1px] border-black text-black font-semibold rounded-md"
                >
                  Edit
                </button>
                <button
                  disabled={isButtonDisabled}
                  onClick={sendInvoice}
                  type="submit"
                  className="mt-6 bg-blue disabled:bg-gray py-[10px] justify-center flex text-[#ffffff] font-bold rounded-md"
                >
                  Send Invoice
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </>
  );
};

export default SendInvoice;
