import React from "react";
import "./styles.css";

const Input = ({ label, state, setState, placeholder, type }) => {
  return (
    <div className="input-wrapper">
      <label className="label-input">{label}</label>
      <input
        className="custom-input"
        type={type}
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
};

export default Input;
