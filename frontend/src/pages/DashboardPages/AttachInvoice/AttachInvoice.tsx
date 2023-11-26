import { Form, Formik, FieldArray } from 'formik';
import InputField from '../../../components/InputField';
import Sidebar from '../../../components/Sidebar/Sidebar';
import * as Yup from 'yup';
import plus_circle from '../../../assets/plus-circle.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '../../../components/Dropdown';
import { useContext, useState } from 'react';
import { UserContextData } from '../../../context/type';
import { UserContext } from '../../../context/UserContext';
import { createNewLabelValueArray } from '../../../helpers';

const generateInvoiceSchema = Yup.object().shape({
  invoiceNumber: Yup.string().required('Invoice Number is required'),
  customerName: Yup.string().required('Customer Name is required'),
  issueDate: Yup.string().required('Issue Date is required'),
  dueDate: Yup.string()
    .required('Due Date is required')
    .test(
      'dueDateValidation',
      'Due Date must be the same or later than issue date',
      function (value) {
        const { issueDate } = this.parent;
        return !issueDate || !value || new Date(value) >= new Date(issueDate);
      },
    ),
  products: Yup.array().of(
    Yup.object().shape({
      productName: Yup.string().required('Product Name is required'),
      productAmount: Yup.number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .positive('Amount must be a positive number'),
      productQuantity: Yup.number()
        .typeError('Quantity must be a number')
        .required('Quantity is required')
        .positive('Quantity must be a positive number'),
    }),
  ),
});

const AttachInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user: UserContextData = useContext(UserContext);

  // Access the state passed from the previous route
  const { state } = location;

  const [chosenCustomer, setChosenCustomer] = useState(
    state?.customerInfo?.id || state?.invoiceCustomer,
  );

  const generateInvoice = async (values: {
    invoiceNumber: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    products: {
      productName: string;
      productAmount: string;
      productQuantity: string;
    }[];
  }) => {
    navigate('/dashboard/attach-invoice/send', {
      state: { values, chosenCustomer },
    });
    //
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-56 lg:pr-10 py-12 lg:py-10 px-2 bg-whiteBg min-h-screen">
        <section className="bg-white rounded-lg py-5 px-11 shadow-sm">
          <h2 className="text-blue font-bold">Create Invoice</h2>
          <p className="text-gray text-sm font-light pt-2">Fill the invoice</p>

          <Formik
            initialValues={{
              invoiceNumber: state?.invoiceValues?.invoiceNumber || '',
              customerName:
                state?.customerInfo?.name ||
                state?.invoiceValues?.customerName ||
                '',
              issueDate: state?.invoiceValues?.issueDate || '',
              dueDate: state?.invoiceValues?.dueDate || '',
              products: state?.invoiceValues?.products || [
                { productName: '', productAmount: '', productQuantity: '' },
              ],
            }}
            validationSchema={generateInvoiceSchema}
            onSubmit={generateInvoice}
          >
            {({ values, setFieldValue }) => (
              <Form className="mx-auto mt-5">
                <div className="grid sm:grid-cols-2 gap-x-16">
                  <InputField
                    label="Invoice Number"
                    placeholder="MGL20OPA"
                    name="invoiceNumber"
                    type="text"
                    width="w-full"
                  />

                  <div>
                    <Dropdown
                      name="customerName"
                      width={100}
                      placeholderText={
                        state?.customerInfo?.name || 'Select Customer'
                      }
                      options={createNewLabelValueArray(
                        user?.customers as any[],
                      )}
                      label="Select Customer Name"
                      value={values.customerName}
                      // onChange={(e: any) => {
                      //   setFieldValue('customerName', e.target.value);
                      // }}
                      onChange={(e: any) => {
                        const selectedOption = createNewLabelValueArray(
                          user?.customers as any[],
                        ).find((option) => option.value === e.target.value);

                        setFieldValue('customerName', selectedOption?.value);
                        setChosenCustomer(selectedOption?.customerId); // Add this line
                      }}
                    />
                  </div>
                  <InputField
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    width="w-full"
                  />
                  <InputField
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    width="w-full"
                  />
                </div>

                <FieldArray name="products">
                  {({ push, remove }) => (
                    <div>
                      {values.products.map((_, index) => (
                        <div
                          key={index}
                          className="grid sm:grid-cols-2 gap-x-16"
                        >
                          <InputField
                            label="Product Name"
                            placeholder="Nike"
                            name={`products.${index}.productName`}
                            type="text"
                            width="w-full"
                          />
                          <div className="flex items-center gap-x-3">
                            <InputField
                              label="Amount (in naira)"
                              placeholder="350"
                              name={`products.${index}.productAmount`}
                              type="number"
                              width="w-full"
                            />
                            <InputField
                              label="Quantity"
                              placeholder="1"
                              name={`products.${index}.productQuantity`}
                              type="number"
                              width="w-full"
                            />
                            <button
                              disabled={values.products.length === 1}
                              type="button"
                              onClick={() => remove(index)}
                              className={`text-red-500 font-bold text-2xl mt-2 ${
                                values.products.length === 1 && 'hidden'
                              }`}
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          push({ productName: '', productAmount: '' })
                        }
                        className="flex items-center text-blue font-bold gap-2 mt-2"
                      >
                        <img src={plus_circle} alt="add" />
                        Add more
                      </button>
                    </div>
                  )}
                </FieldArray>

                {/* <p className="text-gray text-[13px] text-end">Forgot password?</p> */}

                <button
                  // disabled={isButtonDisabled}
                  type="submit"
                  className="mt-6 bg-blue disabled:bg-gray w-full sm:w-80 mx-auto justify-center flex text-[#ffffff] font-bold py-5 rounded-md"
                >
                  Generate Invoice
                </button>
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </>
  );
};

export default AttachInvoice;
