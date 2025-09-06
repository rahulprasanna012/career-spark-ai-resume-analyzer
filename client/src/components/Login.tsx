import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from './Input'
import Button from './Button'
import type { LoginTypes } from '../types/auth'

export default function Login() {
  const [formData, setFormData] = useState<LoginTypes>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
     console.log(formData)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
       
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
        value={formData.password}
        handleChange={handleChange}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        
      </div>

      <Button type="submit" loading={loading} label='Login' handleClick={()=>{}}/>
       

      <div className="text-sm text-center">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Register
        </Link>
      </div>
    </form>
  )
}