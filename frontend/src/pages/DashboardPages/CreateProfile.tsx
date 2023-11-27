import Sidebar from '../../components/Sidebar/Sidebar';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserContextData } from '../../context/type';
import { UserContext } from '../../context/UserContext';
import Modal from 'react-modal';
import success from '../../assets/success.svg';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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

const createProfileSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  address: Yup.string().required('Address is required'),
});

const CreateProfile = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const user: UserContextData = useContext(UserContext);
  const navigate = useNavigate();

  const createProfile = async (
    values: {
      fullName: string;
      email: string;
      phoneNumber: string;
      address: string;
    },
    { resetForm }: any,
  ) => {
    const { fullName, email, phoneNumber, address } = values;

    setIsButtonDisabled(true);
    try {
      await axios.post(
        `/customers?owner_id=${user?.user!._id}`,
        {
          name: fullName,
          email,
          phone: phoneNumber,
          address,
        },
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        },
      );
      resetForm();
      navigate('/dashboard');
      toast.success('Profile created successfully');
      // setSuccessModalIsOpen(true);

      setIsButtonDisabled(false);
    } catch (error: any) {
      const err = JSON.parse(error.response.data.body);
      toast.error(err.detail);
      setIsButtonDisabled(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen flex flex-col justify-center">
        <section className="bg-white rounded-lg py-20 px-11 shadow-sm">
          <h2 className="text-blue font-bold">Create a Customer Profile</h2>
          <p className="text-gray text-sm font-light pt-2">
            Fill the customer information in the form
          </p>

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phoneNumber: '',
              address: '',
            }}
            validationSchema={createProfileSchema}
            onSubmit={createProfile}
          >
            {() => (
              <Form className="mx-auto mt-5">
                <div className="grid sm:grid-cols-2 gap-x-16">
                  <InputField
                    label="Full Name"
                    name="fullName"
                    type="text"
                    width="w-full"
                  />
                  <InputField
                    label="Email address"
                    name="email"
                    type="email"
                    width="w-full"
                  />
                  <InputField
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    width="w-full"
                  />
                  <InputField
                    label="Address"
                    name="address"
                    type="text"
                    width="w-full"
                  />
                </div>

                {/* <p className="text-gray text-[13px] text-end">Forgot password?</p> */}

                <button
                  disabled={isButtonDisabled}
                  type="submit"
                  className="mt-6 bg-blue disabled:bg-gray w-full sm:w-80 mx-auto justify-center flex text-[#ffffff] font-bold py-5 rounded-md"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </section>
      </div>

      <Modal
        isOpen={successModalIsOpen}
        onRequestClose={() => setSuccessModalIsOpen(false)}
        style={customStyles}
        contentLabel="Success Modal"
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
          Profile created successfully
        </p>
      </Modal>
    </>
  );
};

export default CreateProfile;
