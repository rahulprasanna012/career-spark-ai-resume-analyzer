import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from './Input'
import Button from './Button'
import type { RegisterTypes } from '../types/auth'


export default function Register() {
  const [formData, setFormData] = useState<RegisterTypes>({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)


  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log(formData)
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        name="name"
        type="text"
        required
        value={formData.name}
        handleChange={handleChange}
      />

      <Input
        label="Email address"
        name="email"
        type="email"
        required
        value={formData.email}
        handleChange={handleChange}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        required
        minLength={6}
        value={formData.password}
        handleChange={handleChange}
      />

      <Button type="submit" loading={loading} label='Register' handleClick={()=>{}} />
       

      <div className="text-sm text-center">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Login
        </Link>
      </div>
    </form>
  )
}