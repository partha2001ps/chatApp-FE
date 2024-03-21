import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const [pic,setPic]=useState()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [mgs,setMgs]=useState('')

    const { name, email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const postDetails = (pics) => {
        // console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-App");
            data.append("cloud_name", "duygowamx");
            fetch("https://api.cloudinary.com/v1_1/duygowamx/image/upload/", {
                method: "POST",
                body: data,
            })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.url);
                // console.log(data.url.toString());
            })
            .catch((err) => {
                console.error("Error uploading image:", err);
            });
        } else {
            console.error("Unsupported file type");
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !email || !password ) {
            setErrorMessage('All fields are required.');
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post('https://chatapp-be-rghz.onrender.com/', { ...formData, pic });
            // console.log(res.data,formData);
            setMgs(res.data.message)
            if (res.data.message == 'user created') {  
                navigate('/')
            }
            setFormData({
                name: '', email: '', password:''})
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
                                    <label htmlFor="photo">Photo</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="pic"
                                        name="pic"
                                        onChange={(e) => postDetails(e.target.files[0])}
                                    />
                                </div>
                                <div>
                                    <div className='mb-3'>
                                        <Link to='/'>Already have an account? Sign in</Link>
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
                                    <div><p>{mgs}</p></div>
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
