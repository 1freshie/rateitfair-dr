interface TextAreaProps {
  label: string;
  id: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  label,
  id,
  name,
  value,
  placeholder,
  onChange,
}: TextAreaProps) {
  return (
    <div className="w-full flex flex-col justify-center gap-y-1">
      {label && (
        <label
          htmlFor={id}
          className="small-paragraph text-secondary--orange ml-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        className="input focus:outline-none resize-none h-44 md:h-48 lg:h-52 xl:h-56"
        onChange={onChange}
      />
    </div>
  );
}
