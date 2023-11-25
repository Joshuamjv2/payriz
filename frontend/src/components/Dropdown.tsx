import { ErrorMessage } from 'formik';

interface Option {
  value: string;
  label: string;
  customerId: string;
}

interface DropdownProps {
  id?: string;
  value?: string;
  onChange?: any;
  name: string;
  label: string;
  options: Option[];
  width: number;
  placeholderText: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  value,
  onChange,
  name,
  options,
  width,
  placeholderText,
  label,
}) => {
  return (
    <div className="relative mb-4">
      <label htmlFor={name} className="font-semibold text-blue">
        {label}
      </label>
      <select
        className="bg-transparent border-gray placeholder:text-gray focus:outline-none mt-1 focus:border-2 border-[1px] rounded-md py-3 px-[10px] cursor-pointer"
        id={id}
        value={value}
        onChange={onChange}
        style={{ width: `${width}%` }}
        name={name}
      >
        <option value="" defaultValue={''}>
          {placeholderText}
        </option>
        {options?.map((option: Option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-700 text-sm pt-1"
      />
    </div>
  );
};

export default Dropdown;
