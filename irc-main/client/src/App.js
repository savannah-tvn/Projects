import { useState } from 'react';
import './App.css';
import io from "socket.io-client";
import Chat from './Chat'; 

const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername] = useState("");
  const [channel, setChannel] = useState("");
  const [showChat, setShowChat] = useState(false);
  

  const joinChannel = () => {
    if (username !== "" && channel !== "") {
      socket.emit("join_channel", { channel, username });
      setShowChat(true);
    }
  };
  return (
    <div className="App">
      {!showChat ? (
        <div className='card-header text-center'>
          <h3>Let's chat !</h3>
          <div className='input'>
            <input
              type='text'
              placeholder='Username'
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <br />
            <input
              type='text'
              placeholder='Channel'
              onChange={(event) => {
                setChannel(event.target.value);
              }}
              onKeyDown={(event) => {
                if(event.key === 'Enter') {
                  joinChannel();
                }
              }}
            />
          </div>
          <div className='btn'>
            <button onClick={joinChannel}>Start Chat</button>
          </div>
        </div>
      ) : (
        <div className='card'>
        <Chat socket={socket} username={username} channel={channel} />
        </div>
      )}
    </div>
  );
  
}

export default App;
