import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [mgs,setMgs]=useState('')

    const { name, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            setErrorMessage('All fields are required.');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post('https://chatapp-be-rghz.onrender.com/', formData);
            // console.log(res.data);
            setMgs(res.data.message)
            if (res.data.message == 'user created') {  
                navigate('/')
            }
            setFormData({
                name: '', email: '', password:'',confirmPassword:''})
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h1 className="mb-4 text-center text-primary">Welcome to Chat App</h1>
                    <div className="card border-primary">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="sign-up-form">
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <div className='mb-3'>
                                        <Link  to='/'>Already have an account? Sign in</Link>
                                    </div>

                                </div>
                                <div className="text-center">
                                    <button className='submit' type='submit'>{loading ? (<div><RotatingLines
                                        visible={true}
                                        height="46"
                                        width="46"
                                        color="white"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        ariaLabel="rotating-lines-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    /></div>) : (<div>Submit</div>)}</button>
                                    <div><p>{ mgs}</p></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
