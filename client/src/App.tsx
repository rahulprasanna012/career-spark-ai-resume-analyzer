import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Login from './components/Login'
import Register from './components/Register'
import MainLayout from './layout/MainLayout'
import AnalyzePage from './pages/AnalyzePage'
import HistoryPage from './pages/HistoryPage'

const App = () => {
  return (
    <Routes>
        <Route element={<AuthPage/>}>

          <Route  path="/login" element={<Login/>}/>
          <Route  path="/register" element={<Register/>}/>
        </Route>

        <Route element={<MainLayout/>}>

              <Route index element={<AnalyzePage/>}/>
              <Route path='/analyze' element={<AnalyzePage/>}/>
              <Route path='/history' element={< HistoryPage/>}/>


        </Route>


    </Routes>
  )
}

export default App