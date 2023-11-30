import { useState } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../../components/InputField';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

const ForgotPasswordSchema = Yup.object({
  newPassword: Yup.string().required('Password is required'),
  verifyPassword: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.newPassword === value;
    },
  ),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (values: {
    newPassword: string;
    verifyPassword: string;
  }) => {
    const { newPassword, verifyPassword } = values;

    setIsButtonDisabled(true);
    try {
      const res = await axios.post(`/auth/reset-password?token=${token}`, {
        password: newPassword,
        password2: verifyPassword,
      });
      const resBody = JSON.parse(res.data.body);
      console.log(resBody);
      toast.success('Password reset successful');
      navigate('/login', {
        state: { email },
      });
      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="font-bold text-2xl">Reset Password</h1>
      <p className="text-gray text-[13px]">
        {email
          ? `Enter your new password for ${email} to reset it.`
          : 'Enter your new password to reset it'}
      </p>

      <Formik
        initialValues={{
          newPassword: '',
          verifyPassword: '',
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex flex-col mx-auto mt-5">
            <InputField
              label="New Password"
              name="newPassword"
              passwordInput={true}
            />
            <InputField
              label="Confirm New Password"
              name="verifyPassword"
              passwordInput={true}
            />

            <button
              disabled={isButtonDisabled}
              type="submit"
              className="mt-2 bg-blue disabled:bg-gray sm:w-[30rem] w-80 mx-auto text-[#ffffff] font-bold py-5 rounded-md"
            >
              Reset Password
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
