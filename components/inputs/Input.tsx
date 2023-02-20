interface InputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  id,
  name,
  type,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <div className="w-full flex flex-col justify-center gap-y-1">
      <label
        htmlFor={id}
        className="small-paragraph text-secondary--orange ml-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        className="input focus:outline-none"
        onChange={onChange}
      />
    </div>
  );
}
