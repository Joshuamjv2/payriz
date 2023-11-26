import { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';
import { calculateTotalAmount, getPaidInvoices } from '../../../helpers';
import eye from '../../../assets/eye.svg';

const PaidInvoices = () => {
  const user: UserContextData = useContext(UserContext);

  const paidInvoices = getPaidInvoices(user?.invoices as any[]);

  return (
    <div className="mt-5">
      <table className="mt-5 w-full">
        <tbody>
          <tr className="[&>*]:text-left text-gray text-sm">
            <th>Invoice #</th>
            <th>Customer Name</th>
            <th>Amount</th>
            <th>Date Created</th>
            <th className="flex justify-end" />
          </tr>

          {paidInvoices?.map((invoice) => (
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

      {user?.isInvoiceLoading && paidInvoices?.length === 0 && (
        <p className="text-center sm:my-40 my-10 text-gray text-sm">
          Loading...
        </p>
      )}

      {paidInvoices?.length === 0 && !user?.isInvoiceLoading && (
        <p className="text-center sm:my-40 my-10 text-gray text-sm">
          No paid invoices
        </p>
      )}
    </div>
  );
};

export default PaidInvoices;
