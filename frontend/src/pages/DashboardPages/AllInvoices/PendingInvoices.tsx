import { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';
import { calculateTotalAmount, getPendingInvoices } from '../../../helpers';
import eye from '../../../assets/eye.svg';

const PendingInvoices = () => {
  const user: UserContextData = useContext(UserContext);

  const pendingInvoices = getPendingInvoices(user?.invoices as any[]);

  console.log('pendingInvoices', pendingInvoices);

  return (
    <div className="mt-12">
      <table className="mt-5 w-full">
        <tbody>
          <tr className="[&>*]:text-left text-gray text-sm">
            <th>Invoice #</th>
            <th>Customer Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th className="flex justify-end" />
          </tr>

          {pendingInvoices?.map((invoice) => (
            <tr key={invoice.id} className="[&>*]:py-5 text-sm">
              <td>{invoice.invoice_number}</td>
              <td>{invoice.customer.name}</td>
              <td>{calculateTotalAmount(invoice.items)}</td>
              <td>{invoice.due_date}</td>
              <td className="flex justify-end">
                <button type="button">
                  <img src={eye} alt="View" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {user?.isInvoiceLoading && pendingInvoices?.length === 0 && (
        <p className="text-center sm:my-40 my-10 text-gray text-sm">
          Loading...
        </p>
      )}

      {pendingInvoices?.length === 0 && !user?.isInvoiceLoading && (
        <p className="text-center sm:my-40 my-10 text-gray text-sm">
          No pending invoices
        </p>
      )}
    </div>
  );
};

export default PendingInvoices;
