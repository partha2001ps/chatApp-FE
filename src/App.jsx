import React from 'react'
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Chat from './components/Chat'
import Resetpassword from './components/ResetPassword'
import Newpassword from './components/NewPassword'
import UserList from './components/UserList'
import NavLink from './components/NavLink'
import Profile from './components/Profile'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/' element={<SignIn />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/reset-password' element={<Resetpassword />} />
          <Route path='/reset-password/new-password/:OTP' element={<Newpassword />} />
          <Route path='/user' element={<UserList/>} />
          <Route path='/nav' element={<NavLink />} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App