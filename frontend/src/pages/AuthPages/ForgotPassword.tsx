import { useState } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../../components/InputField';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import success from '../../assets/success.svg';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
});

const ForgotPassword = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px',
      padding: '44px 64px',
    },
  };

  const handleSubmit = async (values: { email: string }) => {
    const { email } = values;

    setIsButtonDisabled(true);
    try {
      await axios.post(
        `/auth/request-reset-password?redirect_url=${
          import.meta.env.VITE_FRONTEND_URL
        }/reset-password`,
        {
          username: email,
        },
      );
      setSuccessModalIsOpen(true);
      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="font-bold text-2xl">Forgot Password</h1>
      <p className="text-gray text-[13px]">
        Enter the email address associated with your account and a code will be
        sent to you.
      </p>

      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex flex-col mx-auto mt-5">
            <InputField label="Email address" name="email" type="email" />

            <button
              disabled={isButtonDisabled}
              type="submit"
              className="mt-2 bg-blue disabled:bg-gray sm:w-[30rem] w-80 mx-auto text-[#ffffff] font-bold py-5 rounded-md"
            >
              Next
            </button>
          </Form>
        )}
      </Formik>

      <Link to="/login" className="text-gray text-sm mt-5 text-left">
        Cancel
      </Link>

      <Modal
        isOpen={successModalIsOpen}
        onRequestClose={() => setSuccessModalIsOpen(false)}
        style={customStyles}
        contentLabel="Success Modal"
        appElement={document.getElementById('root') || undefined}
      >
        {/* <button
          onClick={() => setSuccessModalIsOpen(false)}
          className="absolute top-5 right-5"
        >
          X
        </button> */}
        <img src={success} alt="Success" className="mx-auto" />
        <h2 className="font-bold pt-2 text-center">Successful</h2>
        <p className="text-gray text-sm pt-2 text-center">
          You have requested for a password reset. Please check your email
          address to continue
        </p>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
