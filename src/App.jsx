import React from 'react'
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Chat from './components/Chat'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/chat' element={ <Chat/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App