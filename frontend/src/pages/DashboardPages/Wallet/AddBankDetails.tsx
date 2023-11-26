import { Form, Formik } from 'formik';
import Modal, { Styles } from 'react-modal';
import InputField from '../../../components/InputField';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
// import { UserContextData } from '../../../context/type';
// import { UserContext } from '../../../context/UserContext';
// import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get(`/payouts/banks`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        const resBody = JSON.parse(res.data.body);
        console.log(resBody);

        // setUserId(_id);
      } catch (error: any) {
        const err = JSON.parse(error.response.data.body);
        toast.error(err.detail || 'Error fetching banks');
        closeModal();
      }
    };

    fetchBanks();
  }, [closeModal]);

  //   const user: UserContextData = useContext(UserContext);
  //   const navigate = useNavigate();

  const handleCreateDetails = async (values: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => {
    const { accountName, accountNumber, bankName } = values;

    console.log(accountName, accountNumber, bankName);

    setIsButtonDisabled(true);
    // try {
    //   await axios.post(
    //     `/customers?owner_id=${user?.user!._id}`,
    //     {
    //       name: fullName,
    //       email,
    //       phone: phoneNumber,
    //       address,
    //     },
    //     {
    //       headers: {
    //         'Authorization': `Bearer ${Cookies.get('token')}`,
    //       },
    //     },
    //   );
    //   resetForm();
    //   navigate('/dashboard');
    //   toast.success('Profile created successfully');
    //   // setSuccessModalIsOpen(true);

    setIsButtonDisabled(false);
    // } catch (error: any) {
    //   console.log(error);
    //   const err = JSON.parse(error.response.data.body);
    //   toast.error(err.detail);
    //   setIsButtonDisabled(false);
    // }
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
        {() => (
          <Form className="mx-auto mt-5">
            <InputField
              label="Account Name"
              name="accountName"
              type="text"
              width="sm:w-96"
            />
            <InputField
              label="Account Number"
              name="accountNumber"
              type="number"
              width="w-full"
            />
            <InputField
              label="Bank Name"
              name="bankName"
              type="text"
              width="w-full"
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
