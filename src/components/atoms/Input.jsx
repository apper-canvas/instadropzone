import React from 'react';

const Input = ({ id, type = 'text', multiple, onChange, className, ...props }) => {
  return (
    <input
      id={id}
      type={type}
      multiple={multiple}
      onChange={onChange}
      className={className}
      {...props}
    />
  );
};

export default Input;