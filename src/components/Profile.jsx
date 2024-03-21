import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import NavLink from './NavLink';
import { RotatingLines } from 'react-loader-spinner';
import { authInstance } from '../services/instance';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState(null);
  const [id, setId] = useState(null);
  const [formdata, setFormdata] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const postDetails = (pics) => {
    if (pics && (pics.type === "image/jpeg" || pics.type === "image/png")) {
      setLoading(true)
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
        // console.log(data.url)
          setPic(data.url);
          setLoading(false)
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
      });
    } else {
      console.error("Unsupported file type");
    }
  };

  useEffect(() => {
    const data = sessionStorage.getItem('userData');
    if (data) {
      setId(JSON.parse(data).user._id);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authInstance.get(`/user/me/${id}`);
        setFormdata(res.data);
        // console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  useEffect(() => {
    if (formdata) {
      setName(formdata.name);
      setEmail(formdata.email);
      setPic(formdata.pic);
    }
  }, [formdata]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSave = async () => {
    try {
      const res = await authInstance.put(`/edit/${id}`, { name, email, pic });
      console.log(res.data);
      if (res.data.pic) {
        setPic(res.data.pic);
      }
      toast.success('User edit success')
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-f">
      <NavLink /><ToastContainer/>
      <div className="container row justify-content-center mt-5">
        <div className="col-md-8">
          {formdata && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Profile</h5>
                {editMode ? (
                  <>
                    {pic && (
                      <img src={pic} alt="User" className='profile-img' />
                    )}
                    <form>
                      <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={name}
                          onChange={handleNameChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
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
                      <button type="button" className="btn btn-primary mr-2 mt-3" onClick={handleSave}>
                      {loading ? (<div><RotatingLines
                                        visible={true}
                                        height="30"
                                        width="30"
                                        color="white"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        ariaLabel="rotating-lines-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    /></div>) : (<div>save</div>)}
                      </button>
                      <button type="button" className="btn btn-secondary mt-3 mx-3" onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                  <div >
                    {pic && <img src={pic} alt="User" className='profile-img' />}
                  </div>
                      <div>
                      <div className='mt-4 '>Name: {name}</div>
                  <div className='mt-2 '>Email: {email}</div>
                  <button type="button" className="btn btn-primary mt-3 " onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </div>
                </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
