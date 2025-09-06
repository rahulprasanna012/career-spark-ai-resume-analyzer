import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate()
    const token = Cookies.get('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    return children
}