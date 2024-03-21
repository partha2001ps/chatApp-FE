import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UserList({ onSelectUser }) {
    const [users, setUsers] = useState([]);
    const [img, setImg] = useState(false);
    const [one, setOne] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const senderStr = await sessionStorage.getItem('userData');
            if (!senderStr) {
                throw new Error('User data not found in sessionStorage');
            }
            const sender = JSON.parse(senderStr);

            const res = await axios.get(`https://chatapp-be-rghz.onrender.com/${sender.user._id}`);
            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleImg = (im) => {
        setOne(im);
        setImg(!img);
    };

    const handleUserSelect = (user) => {
        onSelectUser(user);
        setImg(false); // Resetting img state to false when a user is selected
    };

    return (
        <div className="left">
            <h1 className="display-4 text-center mt-2 mb-2 text-success">All Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user._id} className="list-unstyled">
                        <div className="user d-flex">
                            <img className='img' onClick={() => handleImg(user.pic)} src={`${user.pic}`} alt="" />
                            <span type='button' className='pro-name' onClick={() => handleUserSelect(user)}>{user.name}</span>
                        </div>
                        <hr className="hr" />
                    </li>
                ))}
            </ul>
            {img ? <><img src={`${one}`} alt="profile" className='single-img' /></> : null}
        </div>
    );
}

export default UserList;
