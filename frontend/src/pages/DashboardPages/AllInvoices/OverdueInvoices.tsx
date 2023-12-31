import { useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';
import {
  calculateTotalAmount,
  formatDateToShortForm,
  getOverdueInvoices,
} from '../../../helpers';
import eye from '../../../assets/eye.svg';
import InvoiceModal from './InvoiceModal';

const OverdueInvoices = () => {
  const user: UserContextData = useContext(UserContext);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  function closeViewModal() {
    setViewModalIsOpen(false);
  }
  const handleViewOpening = (invoice: any) => {
    setViewModalIsOpen(true);
    setActiveInvoice(invoice);
  };

  const overdueInvoices = getOverdueInvoices(user?.invoices as any[]);

  return (
    <div className="mt-5">
      <table className="mt-5 w-full overflow-x-auto block [&::-webkit-scrollbar]:hidden">
        <tbody className="table w-full">
          <tr className="[&>*]:text-left [&>*]:px-2 text-gray text-sm">
            <th className="whitespace-nowrap">Invoice #</th>
            <th className="whitespace-nowrap">Customer Name</th>
            <th className="whitespace-nowrap">Amount (in Naira)</th>
            <th className="whitespace-nowrap">Due Date</th>
            <th className="" />
          </tr>

          {overdueInvoices?.map((invoice) => (
            <tr
              key={invoice.id}
              className="[&>*]:p-2 text-sm cursor-pointer"
              onClick={() => handleViewOpening(invoice)}
            >
              <td className="font-bold">{invoice.invoice_number}</td>
              <td>{invoice.customer.name}</td>
              <td>{calculateTotalAmount(invoice.items)}</td>
              <td className="whitespace-nowrap">
                {formatDateToShortForm(invoice.due_date)}
              </td>
              <td className="flex justify-end">
                <button type="button" className="flex items-center">
                  <img
                    src={eye}
                    alt="View"
                    className="w-3 max-w-[12px] block sm:mb-4"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {user?.isInvoiceLoading && overdueInvoices?.length === 0 && (
        <p className="text-center sm:my-40 my-10 text-gray text-sm">
          Loading...
        </p>
      )}

      {overdueInvoices?.length === 0 && !user?.isInvoiceLoading && (
        <p className="text-center sm:my-40 my-10 text-gray text-sm">
          No overdue invoices
        </p>
      )}

      <InvoiceModal
        modalIsOpen={viewModalIsOpen}
        closeModal={closeViewModal}
        activeInvoice={activeInvoice}
      />
    </div>
  );
};

export default OverdueInvoices;
