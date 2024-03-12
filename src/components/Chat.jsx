import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [id,setId]=useState('')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const senderStr =await sessionStorage.getItem('userData');
      if (!senderStr) {
        throw new Error('User data not found in sessionStorage');
      }
      const sender = JSON.parse(senderStr);
      setId(sender.user); 
      const res = await axios.get(`https://chatapp-be-rghz.onrender.com/${sender.user._id}`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleFetchData = async (user) => {
    try {
      const res = await axios.get(`https://chatapp-be-rghz.onrender.com/chat/${id._id}/${user._id}`);
      setSelectedUser(user);
      setMessages(res.data);
      console.log(messages)
    } catch (error) {
      console.error(error);
    }
  };
  
  const sendMessage = async () => {
    try {
      await axios.post('https://chatapp-be-rghz.onrender.com/chat', {
        senderId: id._id,
        receiverId:selectedUser._id,
        message: message
      });
      setMessage('');
      handleFetchData(selectedUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-3 text-success">Chat Application</h2>
      <div className="row">
        <div className="col-md-6 col-lg-4">
          <div className="left">
            <ul>
              {users.map((user) => (
                <li key={user._id} className="list-unstyled">
                  <button onClick={() => handleFetchData(user)} className="user">
                    {user.name}
                  </button>
                  <hr className="hr" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-6 col-lg-8">
          <div className="right">
            {selectedUser && (
              <>
                <h3 className="selected-user-name">{selectedUser.name}</h3>
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div key={index} className="message">
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </>
            )}
            {!selectedUser && <p className="mgs">No user selected</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
