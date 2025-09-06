import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='h-screen bg-indigo-50/25   '>
        <Navbar/>
        <Outlet/>


    </div>
  )
}

export default MainLayout