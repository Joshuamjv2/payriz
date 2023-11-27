import { Form, Formik } from 'formik';
import Modal, { Styles } from 'react-modal';
import InputField from '../../../components/InputField';
import { useEffect, useState, useContext } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Dropdown from './Dropdown';
import { UserContext } from '../../../context/UserContext';
import { UserContextData } from '../../../context/type';

const bankDetailsSchema = Yup.object().shape({
  accountName: Yup.string().required('Account name is required'),
  accountNumber: Yup.string().required('Account Number is required'),
  bankName: Yup.string().required('Bank Name is required'),
});

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

const AddBankDetails = ({
  modalIsOpen,
  closeModal,
}: {
  modalIsOpen: any;
  closeModal: any;
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [bankDetails, setBankDetails] = useState<any[]>([]);
  const user: UserContextData = useContext(UserContext);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get(`/payouts/banks`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        const resBody = JSON.parse(res.data.body);
        setBankDetails(resBody);

        // setUserId(_id);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching banks');
        closeModal();
      }
    };

    fetchBanks();
  }, [closeModal, user?.user]);

  const transformedBankDetails = bankDetails?.reduce(
    (uniqueBanks, item) => {
      if (!uniqueBanks.names.has(item.name)) {
        uniqueBanks.names.add(item.name);

        uniqueBanks.result.push({
          value: item.name,
          label: item.name,
          bank_name: item.name,
          bank_code: item.code,
          bank_type: item.type,
        });
      }

      return uniqueBanks;
    },
    { names: new Set(), result: [] },
  ).result;

  const handleCreateDetails = async (values: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => {
    const { accountName, accountNumber, bankName } = values;

    const bankInfo = transformedBankDetails?.find(
      (item: { bank_name: string }) => item.bank_name === bankName,
    );

    setIsButtonDisabled(true);
    try {
      await axios.post(
        `/payouts?owner=${user?.user!._id}`,
        {
          account_number: String(accountNumber),
          account_name: accountName,
          bank_code: bankInfo?.bank_code,
          bank_name: bankName,
          bank_type: bankInfo?.bank_type,
          currency: 'NGN',
        },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      closeModal();
      toast.success('Bank Details added successfully');

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
      <h2 className="text-blue font-bold">Add Bank Details</h2>
      <p className="text-gray font-light text-sm">
        Kindly provide your bank details
      </p>

      <Formik
        initialValues={{
          accountName: '',
          accountNumber: '',
          bankName: '',
        }}
        validationSchema={bankDetailsSchema}
        onSubmit={handleCreateDetails}
      >
        {({ values, setFieldValue }) => (
          <Form className="mx-auto mt-5">
            <InputField
              label="Account Name"
              name="accountName"
              type="text"
              width="w-full"
            />
            <InputField
              label="Account Number"
              name="accountNumber"
              type="number"
              width="w-full"
            />
            <Dropdown
              name="bankName"
              label="Bank Name"
              placeholderText="Bank Name"
              value={values.bankName}
              onChange={(e: any) => {
                setFieldValue('bankName', e.target.value);
              }}
              width={100}
              options={transformedBankDetails}
            />

            <button
              disabled={isButtonDisabled}
              type="submit"
              className="mt-5 mx-auto w-full bg-blue disabled:bg-gray px-10 justify-center flex text-[#ffffff] font-bold py-[10px] rounded-md"
            >
              Add Bank
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddBankDetails;
