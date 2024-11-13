import React from "react";

type TextfieldProps = {
  htmlFor: string;
  type?: string;
  label: string;
  value: string;
  onChange?: (...args: any) => any;
};
const Textfield = ({ htmlFor, label,type = 'text', value, onChange }: TextfieldProps) => {
  return (
    <div>
      {" "}
      <label htmlFor={htmlFor} className="text-gray-600 font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-xl my-2 border border-gray-300"
        value={value}
      />
    </div>
  );
};

export default Textfield;
