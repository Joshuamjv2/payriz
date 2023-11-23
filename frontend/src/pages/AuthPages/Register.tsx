import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import heroImg from '../../assets/woman-hero.svg';
import { registerUser } from '../../store/userSlice';
import { AppDispatch } from '../../store/store';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  password: Yup.string().required('Password is required'),
});

const Register = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const register = async (values: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    const { fullName, email, phoneNumber, password } = values;
    setIsButtonDisabled(true);
    try {
      console.log(fullName, email, phoneNumber, password);
      dispatch(registerUser({ fullName, email, phoneNumber, password }));
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <section className="py-10 mx-auto">
        <h1 className="font-bold text-2xl text-center">Create Account</h1>
        <Formik
          initialValues={{
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={register}
        >
          {(formik) => (
            <Form className="flex flex-col mx-auto mt-10">
              <InputField label="Full Name" name="fullName" />
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
