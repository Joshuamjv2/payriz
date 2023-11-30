import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import heroImg from '../../assets/woman-hero.svg';
import welcome from '../../assets/welcome-hand.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchParams] = useSearchParams();
  const verificationEmail = searchParams.get('email');
  const { state } = location;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const logIn = async (values: { email: string; password: string }) => {
    const { email, password } = values;

    setIsButtonDisabled(true);
    try {
      const res = await axios.post(
        `/auth/login`,
        {
          username: email,
          password,
        },
        {
          headers: headers,
        },
      );
      const resBody = JSON.parse(res.data.body);

      // API request needs to be from the same domain to set as secure (for iOs, Safari and)
      Cookies.set('token', resBody.access_token, { secure: true });
      Cookies.set('refresh-token', resBody.refresh_token, { secure: true });
      toast.success('Login successful');
      // axios.defaults.headers.common[
      //   'Authorization'
      // ] = `Bearer ${resBody?.access_token}`;
      setIsButtonDisabled(false);
      navigate('/dashboard');
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="flex items-center justify-between min-h-screen">
      <img
        src={heroImg}
        alt="Woman leaning on table"
        className="xl:block hidden"
      />
      <section className="mx-auto">
        <h1 className="font-bold text-2xl text-center flex mx-auto justify-center items-center gap-2">
          Welcome Back{' '}
          <span>
            <img src={welcome} alt="Welcome" />
          </span>
        </h1>
        <Formik
          initialValues={{
            email: verificationEmail || state?.email || '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={logIn}
        >
          {() => (
            <Form className="flex flex-col mx-auto mt-5">
              <InputField label="Email address" name="email" type="email" />
              <InputField
                label="Password"
                name="password"
                passwordInput={true}
              />

              <Link
                to="/forgot-password"
                className="text-end text-gray text-sm"
              >
                Forgot password?
              </Link>

              <button
                disabled={isButtonDisabled}
                type="submit"
                className="mt-6 bg-blue disabled:bg-gray sm:w-[30rem] w-80 mx-auto text-[#ffffff] font-bold py-5 rounded-md"
              >
                Log In
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center mt-6 text-gray text-[13px]">
          Don't have an account?{' '}
          <button className="text-blue" onClick={() => navigate('/register')}>
            Sign up
          </button>
        </p>
      </section>
    </div>
  );
};

export default Login;
