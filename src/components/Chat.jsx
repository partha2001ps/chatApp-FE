import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import TimeAgo from 'timeago-react';
import UserList from './UserList';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messageEndRef = React.createRef();
  const [id, setId] = useState('');
  const [view, setView] = useState(true);

  useEffect(() => {
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

  const handleFetchData = async (user) => {
    try {
      const senderStr = await sessionStorage.getItem('userData');
      if (!senderStr) {
        throw new Error('User data not found in sessionStorage');
      }
      const sender = JSON.parse(senderStr);
      setId(sender.user);
      const userId = sender.user._id; 
      const res = await axios.get(`https://chatapp-be-rghz.onrender.com/chat/${userId}/${user._id}`);
      setSelectedUser(user);
      setMessages(res.data);
      setView(false);
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

  const handleBack = () => {
    setSelectedUser(null);
    setView(true);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-3 text-success">Chat Application</h2>
      <div className="row">
        <div className={view ? "col-md-6 col-lg-4" : "col-md-6 col-lg-4 d-none d-md-block"}>
          <UserList onSelectUser={handleFetchData} />
        </div>
        <div className={view ? "col-md-6 col-lg-8 d-none d-md-block" : "col-md-6 col-lg-8"}>
          <div className="right" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {selectedUser && (
              <>
                <div className="selected-user-name" style={{ display: 'flex' }}>
                  {!view && (
                    <div className="d-md-none">
                      <button className="btn" onClick={() => setView(true)}>🔙</button>
                    </div>
                  )}
                  <h3 className='name'>{selectedUser.name}</h3>
                </div>
                <div className="chat-box" style={{ height: "70vh", overflowY: "scroll", position: "relative" }}>
                  <ScrollToBottom className="messages">
                    {messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.sender === id._id || msg.senderId === id._id ? 'sender' : 'receiver'}`}>
                        <div className="message-content d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            {msg.message}
                          </div>
                          <br />
                          <div className='text-end'>
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
