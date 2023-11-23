import React, { useState } from 'react';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  passwordInput?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  type,
  passwordInput,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState('password');

  const togglePassword = () =>
    // Password visibility
    setShowPassword((prevState) =>
      prevState === 'password' ? 'text' : 'password',
    );

  const eyeIcon =
    showPassword === 'password' ? (
      <FaEye size="1.2rem" />
    ) : (
      <FaEyeSlash size="1.2rem" />
    );

  return (
    <div className="flex flex-col mx-auto mb-6">
      <label htmlFor={name} className="font-semibold">
        {label}
      </label>
      <div className="relative">
        <Field name={name}>
          {({ field }: FieldProps) => (
            <input
              {...field}
              placeholder={placeholder || label}
              className="mt-1 focus:border-2 border-[1px] rounded-md py-5 px-[10px] sm:w-[30rem] w-80 bg-transparent border-gray placeholder:text-gray focus:outline-none"
              type={type || showPassword}
              {...props}
            />
          )}
        </Field>

        {passwordInput && (
          <span
            className="absolute top-[40%] right-[3%]"
            onClick={togglePassword}
            style={{ cursor: 'pointer' }}
          >
            {eyeIcon}
          </span>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-700 text-sm pt-1"
      />
    </div>
  );
};

export default InputField;
