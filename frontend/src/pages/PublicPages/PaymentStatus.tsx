import { useSearchParams } from 'react-router-dom';
import caution from '../../assets/caution.svg';
import deleteIcon from '../../assets/delete-alarm.svg';
import success from '../../assets/mark-success.svg';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('paid');

  return (() => {
    switch (paymentStatus) {
      case 'already-paid':
        return (
          <div className="flex justify-center items-center h-screen sm:gap-x-6 gap-x-2 sm:mx-0 mx-2">
            <img src={caution} alt="caution" />
            <div>
              <h1 className="font-bold">Already Paid</h1>
              <p className="text-gray">
                You have already paid for this invoice and you can’t make
                another payment.
              </p>
            </div>
          </div>
        );
      case 'no-invoice':
        return (
          <div className="flex justify-center items-center h-screen sm:gap-x-6 gap-x-2 sm:mx-0 mx-2">
            <img src={caution} alt="caution" />
            <div>
              <h1 className="font-bold">Broken Link</h1>
              <p className="text-gray">Payment link is possibly broken</p>
            </div>
          </div>
        );
      case 'paid':
        return (
          <div className="flex justify-center items-center h-screen sm:gap-x-6 gap-x-2 sm:mx-0 mx-2">
            <img src={success} alt="successful payment" />
            <div>
              <h1 className="font-bold">Successful payment</h1>
              <p className="text-gray">
                Your payment has been made successfully
              </p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex justify-center items-center h-screen sm:gap-x-6 gap-x-2 sm:mx-0 mx-2">
            <img src={deleteIcon} alt="Payment failed" />
            <div>
              <h1 className="font-bold">Failed payment</h1>
              <p className="text-gray">
                Your payment has failed. Please try again later.
              </p>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="flex justify-center items-center h-screen sm:gap-x-6 gap-x-2 sm:mx-0 mx-2">
            <img src={caution} alt="caution" />
            <div>
              <h1 className="font-bold">Pending Payment</h1>
              <p className="text-gray">Your payment is pending</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center items-center h-screen sm:gap-x-6 gap-x-2 sm:mx-0 mx-2">
            <div>
              <h1 className="font-bold">No status</h1>
            </div>
          </div>
        );
    }
  })();
};

export default PaymentStatus;
