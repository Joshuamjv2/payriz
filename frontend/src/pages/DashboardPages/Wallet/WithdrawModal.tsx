import { Form, Formik } from 'formik';
import Modal, { Styles } from 'react-modal';
import InputField from '../../../components/InputField';
import { useEffect, useState, useContext } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Dropdown from './Dropdown';
import { UserContextData } from '../../../context/type';
import { UserContext } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
// import { UserContextData } from '../../../context/type';
// import { UserContext } from '../../../context/UserContext';
// import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

const customStyles: Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '32px 52px',
  },
  overlay: {
    position: 'fixed',
    background: 'rgba(24, 49, 64, 0.63)',
    backdropFilter: 'blur("91px")',
    zIndex: 1,
  },
};

const WithdrawModal = ({
  modalIsOpen,
  closeModal,
  storedWallet,
}: {
  modalIsOpen: any;
  closeModal: any;
  storedWallet: any;
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [storedBankDetails, setBankDetails] = useState<any[]>([]);
  const user: UserContextData = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoredBanks = async () => {
      try {
        const res = await axios.get(`/payouts?owner=${user?.user!._id}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        const resBody = JSON.parse(res.data.body);
        setBankDetails(resBody);

        // setUserId(_id);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching bank details');
        closeModal();
      }
    };

    fetchStoredBanks();
  }, [closeModal, user?.user]);

  const withdrawSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError('Amount must be a number')
      .required('Amount is required')
      .max(
        storedWallet?.balance,
        `Amount must be greater than or equal to your balance`,
      ),
    withdrawMethod: Yup.string().required('Valid account is required'),
    reason: Yup.string().required('Reason is required'),
  });

  const transformedBankDetails = storedBankDetails?.map((item) => ({
    name: `${item.bank} - ${item.name}`,
    label: `${item.bank} - ${item.name}`,
    value: `${item.bank} - ${item.name}`,
    id: item.id,
    bank_name: item.bank,
  }));

  //   const user: UserContextData = useContext(UserContext);
  //   const navigate = useNavigate();

  const handleCreateDetails = async (values: {
    amount: string;
    withdrawMethod: string;
    reason: string;
  }) => {
    const { amount, withdrawMethod, reason } = values;

    const bankInfo = transformedBankDetails?.find(
      (item: { value: string }) => item.value === withdrawMethod,
    );

    setIsButtonDisabled(true);
    try {
      await axios.post(
        `/payouts/request_payout?payout_account_id=${bankInfo?.id}`,
        {
          reason,
          amount,
          from_wallet_id: storedWallet?.id,
        },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      closeModal();
      navigate('/dashboard');
      toast.success('Withdrawal successful');

      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Bank Details Modal"
      appElement={document.getElementById('root') || undefined}
    >
      <button
        onClick={() => closeModal()}
        className="flex w-full justify-end font-semibold"
      >
        x
      </button>
      <h2 className="text-blue font-bold">Request Withdrawl</h2>

      {storedBankDetails.length === 0 && (
        <p className="text-gray text-sm font-light pt-2">
          You need to add a bank account before you can withdraw
        </p>
      )}
      <Formik
        initialValues={{
          amount: '',
          withdrawMethod: '',
          reason: '',
        }}
        validationSchema={withdrawSchema}
        onSubmit={handleCreateDetails}
      >
        {({ values, setFieldValue }) => (
          <Form className="mx-auto mt-5">
            <InputField
              label="Payout Amount (in Naira)"
              name="amount"
              type="number"
              width="w-full"
            />
            <Dropdown
              name="withdrawMethod"
              label="Select Account"
              placeholderText="Select Account"
              value={values.withdrawMethod}
              onChange={(e: any) => {
                console.log(e.target.value);
                setFieldValue('withdrawMethod', e.target.value);
              }}
              width={100}
              options={transformedBankDetails}
            />
            <div className="mt-3">
              <InputField
                label="Reason for Withdrawal"
                name="reason"
                type="text"
                width="w-full"
              />
            </div>

            <button
              disabled={isButtonDisabled}
              type="submit"
              className="mt-5 mx-auto w-full bg-blue disabled:bg-gray px-10 justify-center flex text-[#ffffff] font-bold py-[10px] rounded-md"
            >
              Request Withdrawal
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default WithdrawModal;
