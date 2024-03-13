import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import TimeAgo from 'timeago-react';

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const [socket, setSocket] = useState(null);
  const messageEndRef = React.createRef();

  useEffect(() => {
    fetchData();
    const newSocket = io('https://chatapp-be-rghz.onrender.com');
    setSocket(newSocket);

    newSocket.on('message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (id._id) {
      socket.emit("join", id._id);
    }
  }, [id._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      const senderStr = await sessionStorage.getItem('userData');
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
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      if (message.trim() !== "") { 
        socket.emit('message', {
          senderId: id._id,
          receiverId: selectedUser._id,
          newMessage: message,
        });
        setMessages(prevMessages => [...prevMessages, { senderId: id._id, receiverId: selectedUser._id, message: message }]);
        setMessage('');
      }
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
                  <button onClick={() => handleFetchData(user)} className="user btn btn-primary btn-block">
                    {user.name}
                  </button>
                  <hr className="hr" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-6 col-lg-8">
          <div className="right" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {selectedUser && (
              <>
                <h3 className="selected-user-name">{selectedUser.name}</h3>
                <div className="chat-box" style={{ flex: 1, maxHeight: "440px", overflowY: "scroll" }}>
                  <ScrollToBottom className="messages">
                    {messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.sender === id._id ||msg.senderId===id._id? 'sender' : 'receiver'}`}>
                          <div className="message-content d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {msg.message}
                        </div>
                        <br />
                        <div className=' text-end'>
                        <sub className="timeago"><TimeAgo datetime={msg.timestamp} /></sub>
                          </div>
                          </div>
                      </div>
                    ))}

                    <div ref={messageEndRef} />
                  </ScrollToBottom>
                </div>
                <div className="input-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary fs-4"
                      type="button"
                      onClick={sendMessage}
                    >
                      ⩥
                    </button>
                  </div>
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
