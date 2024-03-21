import React from 'react'
import '@fortawesome/fontawesome-free/css/all.css';
import { Link, useNavigate } from 'react-router-dom';

function NavLink() {
    const navigate=useNavigate()
    const handleLogout = () => {
        sessionStorage.removeItem('userdata')
  navigate('/')
    }
    return (
        <div className="container-fluid bg-light">
            <div className="row align-items-center py-3">
                <div className="col">
                    <h2 className='text-success mb-0'>Chat Application</h2>
                </div>
                <div className="col-auto">
                    <Link to='/chat'>
                        <i className='fas fa-home profile ml-3'></i>
                    </Link>
                    <Link to='/profile'><i className='fas fa-user-edit profile ml-3'></i></Link>
                    <button className=' border-0  bg-light ' onClick={handleLogout}>
                        <i className='fas fa-sign-out-alt logout ml-3'></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
export default NavLink