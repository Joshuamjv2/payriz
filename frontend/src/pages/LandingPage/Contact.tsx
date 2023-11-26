import { Formik, Form, Field, ErrorMessage } from 'formik';
import InputField from '../../components/InputField';
import * as Yup from 'yup';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const contactFormSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  message: Yup.string().required('Message is required'),
});

const Contact = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const sendContactMessage = async (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      message: string;
    },
    { resetForm }: any,
  ) => {
    const { firstName, lastName, email, phoneNumber, message } = values;

    console.log(firstName, lastName, email, phoneNumber, message);

    setIsButtonDisabled(true);
    try {
      await axios.post(
        `/contact`,
        {
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
          email,
          message,
        },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      resetForm();
      toast.success('Your message has been sent!');

      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div
      id="contact"
      className="py-10 sm:px-auto px-5 border-t-gray border-b-gray border-r-0 border-l-0 border-[1px] border-opacity-25"
    >
      <h1 className="text-center font-bold text-xl mb-5 ">Contact Us</h1>
      <h1 className="text-center font-bold text-3xl mb-5">Get in touch</h1>
      <p className="text-gray text-center">
        We’d love to hear from you. Please fill out this form.
      </p>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: '',
        }}
        validationSchema={contactFormSchema}
        onSubmit={sendContactMessage}
      >
        {() => (
          <Form className="xl:mx-96 lg:mx-64 md:mx-40 sm:mx-10 mt-5">
            <div className="grid sm:grid-cols-2 sm:gap-x-16 gap-x-5">
              <InputField
                label="First Name"
                name="firstName"
                type="text"
                width="w-full"
              />
              <InputField
                label="Last Name"
                name="lastName"
                type="text"
                width="w-full"
              />
              <div className="col-span-2">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  width="w-full"
                />
              </div>
              <div className="col-span-2">
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  width="w-full"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="message"
                  className="font-semibold whitespace-nowrap"
                >
                  Message
                </label>
                <Field
                  id="message"
                  as="textarea"
                  name="message"
                  className="bg-transparent border-gray placeholder:text-gray focus:outline-none mt-1 focus:border-2 border-[1px] rounded-md py-3 px-[10px] w-full"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-700 text-sm pt-1"
                />
              </div>
            </div>

            <button
              disabled={isButtonDisabled}
              type="submit"
              className="mt-6 bg-blue disabled:bg-gray w-full mx-auto justify-center flex text-[#ffffff] font-bold py-5 rounded-md"
            >
              Send Message
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Contact;
