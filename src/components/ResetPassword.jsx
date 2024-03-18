import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authInstance } from '../services/instance';

function Resetpassword() {
  const [email, setEmail] = useState('');
  const[mgs,setMgs]=useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await authInstance.post('/reset-password', {email})
      // console.log(res.data)
      setMgs(res.data.message)
      setEmail('')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
       <div className='outside'> <div>
        <h2>Reset Password</h2>
        <label>Email Id:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail( e.target.value );
          }}
          required
        />
        <div>
          <button onClick={handleSendOTP}>Send Reset Link</button>
          <p>{ mgs}</p>
        </div>
      </div>
   <Link to='/'>Login</Link></div>
    </div>
  )
}

export default Resetpassword