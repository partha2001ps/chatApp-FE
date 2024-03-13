import axios from 'axios';
import React, { useEffect, useState } from 'react'

function UserList({ onSelectUser }) {
    const [users, setUsers] = useState([]);
  
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
  
    return (
      <div className="left">
        <ul>
          {users.map((user) => (
            <li key={user._id} className="list-unstyled">
              <button onClick={() => onSelectUser(user)} className="user btn btn-primary btn-block">
                {user.name}
              </button>
              <hr className="hr" />
            </li>
          ))}
        </ul>
      </div>
    );
}

export default UserList;
