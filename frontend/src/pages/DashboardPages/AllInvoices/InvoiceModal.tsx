import Modal, { Styles } from 'react-modal';
import {
  calculateViewableTotalAmount,
  formatDateToShortForm,
  isOverdue,
} from '../../../helpers';

const customStyles: Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '6px 10px',
  },
  overlay: {
    position: 'fixed',
    background: 'rgba(24, 49, 64, 0.63)',
    backdropFilter: 'blur("91px")',
    zIndex: 1,
  },
};

const InvoiceModal = ({
  modalIsOpen,
  closeModal,
  activeInvoice,
}: {
  modalIsOpen: any;
  closeModal: any;
  activeInvoice: any;
}) => {
  console.log(activeInvoice);
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="View Modal"
      appElement={document.getElementById('root') || undefined}
    >
      <section className="bg-white py-5 shadow-sm sm:px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-blue font-bold">
            Invoice #{activeInvoice?.invoiceNumber}
          </h2>
          <a
            className="text-xs"
            href={activeInvoice?.url}
            aria-label="Download pdf"
          >
            Download pdf
          </a>
        </div>
        <div className="bg-blue bg-opacity-25 rounded-lg mt-7 py-3 px-5 flex gap-x-10 justify-between">
          <div>
            <h2 className="font-bold text-[13px]">Invoice Number</h2>
            <div className="mt-3 text-xs font-light">
              <p>{activeInvoice?.invoice_number}</p>
              <p>
                Issued Date:{' '}
                {formatDateToShortForm(activeInvoice?.invoice_date)}
              </p>
              <p>Due Date: {formatDateToShortForm(activeInvoice?.due_date)}</p>
            </div>
          </div>
          <div className="text-end ">
            <h2 className="font-bold text-[13px]">Bill to</h2>
            <div className="mt-3 text-xs font-light">
              <p>{activeInvoice?.customer?.name}</p>
              <p>{activeInvoice?.customer?.email}</p>
              {/* <p>{activeInvoice?.customer?.name}</p> */}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-[13px]">Item Details</h2>
          <p className="text-xs font-light">Item description and information</p>
          <table className="mt-6 w-full overflow-x-auto">
            <tbody className="">
              <tr className="[&>*]:text-left text-gray text-sm">
                <th>ITEM</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th className="flex justify-end">Amount</th>
              </tr>
              {activeInvoice?.items?.map((item: any, index: string) => (
                <tr
                  className="[&>*]:py-1 text-xs"
                  key={`${item.name} ${index}`}
                >
                  <td>{item.name}</td>
                  <td>{item.quantity.toFixed(2)}</td>
                  <td>{item.unit_cost.toFixed(2)}</td>
                  <td className="flex justify-end">
                    {(item.quantity * item.unit_cost).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 flex justify-end">
            <div className="flex gap-20 font-semibold text-xs border-t-[1px] border-t-gray pt-2">
              <p>Total</p>
              <p>
                {calculateViewableTotalAmount(activeInvoice?.items)?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {activeInvoice?.status === 'paid' && (
          <p className="text-sm text-blue">Status: {activeInvoice?.status}</p>
        )}
        {activeInvoice?.status === 'pending' &&
          !isOverdue(activeInvoice?.due_date) && (
            <p className="text-sm text-blue">Status: {activeInvoice?.status}</p>
          )}

        {activeInvoice?.status === 'pending' &&
          isOverdue(activeInvoice?.due_date) && (
            <p className="text-sm text-red-400">Status: Overdue</p>
          )}
      </section>
    </Modal>
  );
};

export default InvoiceModal;
