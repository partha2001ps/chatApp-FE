import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('https://chatapp-be-rghz.onrender.com/signin', formData);
            console.log(res.data);
            setMessage(res.data.message);
            setLoading(false);
            if (res.data.message === 'User Login success') {
                sessionStorage.setItem('userData', JSON.stringify(res.data));
                navigate('/chat');
            } else {
                navigate('/');
            }
            setFormData({ email: '', password: '' });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h1 className="mb-4 text-center text-primary">Login to Chat App</h1>
                    <div className="card border-primary">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
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
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
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
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <RotatingLines
                                                visible={true}
                                                height="24"
                                                width="24"
                                                color="white"
                                                strokeWidth="5"
                                                animationDuration="0.75"
                                                ariaLabel="rotating-lines-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                            />
                                        ) : (
                                            'Submit'
                                        )}
                                    </button>
                                </div>
                                <p className="mt-3 text-center">{message}</p>
                            </form>
                            <div className="mt-3 text-center">
                                <Link to="/signup" className="me-3">If new user Signup</Link>
                                <Link to="/reset-password">Reset Password</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
