import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/woman-hero.svg';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  password: Yup.string().min(8).required('Password is required'),
});

const Register = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const register = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    const { firstName, lastName, email, phoneNumber, password } = values;
    setIsButtonDisabled(true);
    try {
      await axios.post(
        `/users?redirect_url=${import.meta.env.VITE_FRONTEND_URL}/login`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
          password,
        },
      );
      toast.success('Please check your email address to continue', {
        autoClose: 50000,
      });

      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <section className=" mx-auto">
        <h1 className="font-bold text-2xl text-center mt-3">Create Account</h1>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={register}
        >
          {(formik) => (
            <Form className="flex flex-col mx-auto mt-5">
              <InputField label="First Name" name="firstName" type="text" />
              <InputField label="Last Name" name="lastName" type="text" />
              <InputField label="Email address" name="email" type="email" />
              <InputField label="Phone Number" name="phoneNumber" type="tel" />
              <InputField
                label="Password"
                name="password"
                passwordInput={true}
              />

              <p className="text-gray text-[13px] text-center">
                By clicking sign up, you accept our{' '}
                <span className="text-blue">Terms </span>
                and <span className="text-blue">Conditions</span>
              </p>

              <button
                disabled={!formik.isValid || !formik.dirty || isButtonDisabled}
                type="submit"
                className="mt-6 bg-blue disabled:bg-gray sm:w-[30rem] w-80 mx-auto text-[#ffffff] font-bold py-5 rounded-md"
              >
                Sign up
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-6 text-gray text-[13px]">
          Already have an account?{' '}
          <button className="text-blue" onClick={() => navigate('/login')}>
            Sign in
          </button>
        </p>
      </section>

      <img
        src={heroImg}
        alt="Woman leaning on table"
        className="xl:block hidden"
      />
    </div>
  );
};

export default Register;
