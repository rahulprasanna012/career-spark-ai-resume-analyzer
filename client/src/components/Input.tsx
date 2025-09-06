import type React from "react"
import type { InputTypes, RegisterTypes } from "../types/auth"

 const Input:React.FC<InputTypes> =({
  label,
  name,
  type = 'text',
  required = false,
  value,
  handleChange,
  minLength
}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type={type}
          minLength={minLength}
          required={required}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  )


export default Input