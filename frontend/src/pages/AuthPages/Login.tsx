import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/woman-hero.svg';
import welcome from '../../assets/welcome-hand.svg';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/userSlice';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const logIn = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setIsButtonDisabled(true);
    try {
      console.log(email, password);
      dispatch(loginUser({ email, password }));
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <img
        src={heroImg}
        alt="Woman leaning on table"
        className="xl:block hidden"
      />
      <section className="py-10 mx-auto">
        <h1 className="font-bold text-2xl text-center flex mx-auto justify-center items-center gap-2">
          Welcome Back{' '}
          <span>
            <img src={welcome} alt="Welcome" />
          </span>
        </h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={logIn}
        >
          {(formik) => (
            <Form className="flex flex-col mx-auto mt-10">
              <InputField label="Email address" name="email" type="email" />
              <InputField
                label="Password"
                name="password"
                passwordInput={true}
              />

              {/* <p className="text-gray text-[13px] text-end">Forgot password?</p> */}

              <button
                disabled={!formik.isValid || !formik.dirty || isButtonDisabled}
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
