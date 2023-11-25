interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
}

const ReadOnlyCalendar: React.FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  value,
}) => {
  return (
    <div className={`flex flex-col mx-auto mb-4 w-full`}>
      <label
        htmlFor={name}
        className="font-semibold text-gray text-sm whitespace-nowrap"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          value={value}
          readOnly
          placeholder={placeholder}
          className={`mt-1 focus:border-2 w-full border-[1px] rounded-md py-3 px-[10px] bg-transparent border-gray placeholder:text-gray focus:outline-none`}
          type="date"
        />
      </div>
    </div>
  );
};

export default ReadOnlyCalendar;
