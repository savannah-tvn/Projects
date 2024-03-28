import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Offcanvas } from 'react-bootstrap';
import { io } from 'socket.io-client';

function Chat({ username, setUsername, channel }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [channels, setChannels] = useState(['General']);
  const [newChannel, setNewChannel] = useState("");
  const [showChannels, setShowChannels] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(channel);
  const [currentChannel, setCurrentChannel] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [removeChannelAlert, setRemoveChannelAlert] = useState(false);
  const [showCreateChannelAlert, setShowCreateChannelAlert] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [editChannel, setEditChannel] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [commands, setCommands] = useState("");

  const socket = io('http://localhost:3001');

  const sendMessage = async () => {
    if (currentMessage !== "") {
      if (currentMessage.startsWith("/")) {
        handleCommand("/" + currentMessage);
      } else {
        const messageData = {
          channel: selectedChannel,
          author: username,
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };

        await socket.emit("send_message", messageData);
        console.log(currentMessage);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }

      setCurrentMessage("");
    }
  };

  const handleCommand = (message) => {
    const [commandName, ...args] = message.substring(1).split(" ");

    switch (commandName.toLowerCase()) {
      case "nick":
        handleNicknameCommand(args[0]);
        break;
      case "list": 
        handleListCommand(args[0]);
        break;
      case "create":
        handleCreateCommand(args[0]);
        break;
      case "delete":
        handleDeleteCommand(args[0]);
        break;
      case"join":
        handleJoinCommand(args[0]);
        break;
      case "leave":
        handleLeaveCommand(args[0]);
        break;
      case "users":
        handleUsersCommand();
        break;
      case "msg":
        handleMsgCommand(args[0], args.slice(1).join(""));
        break;
      default:
        handleDefaultCommand(message);
        break;
    }
  };

  const handleNicknameCommand = (nickname) => {
    socket.emit('change_nickname', { nickname });

    socket.username = nickname;

    const messageData = {
      channel: selectedChannel,
      author: "Server",
      message: `${username} changed nickname to ${nickname}`,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);
    setUsername(nickname);
    setMessageList((list) => [...list, messageData]);
  };

  const handleListCommand = (filter) => {
    const filteredChannels = channels.filter((channel) =>
      channel.toLowerCase().includes(filter.toLowerCase())
    );

    console.log(filteredChannels);
  };

  const handleCreateCommand = (channel) => {
    setChannels((prevChannels) => [...prevChannels, channel]);
  };

  const handleDeleteCommand = (channel) => {
    setChannels((prevChannels) =>
      prevChannels.filter((c) => c !== channel)
    );
  };

  const handleJoinCommand = (channel) => {
    setSelectedChannel(channel);
  };

  const handleLeaveCommand = (channel) => {
    setSelectedChannel("General");
  };

  const handleUsersCommand = () => {
    const users = Array.from(connectedUsers);

    console.log(users);
  };

  const handleMsgCommand = (nickname, message) => {
    console.log(`Message to ${nickname}: ${message}`);
  };

  const handleDefaultCommand = (message) => {
    console.log(`Message to all: ${message}`);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`User ${username} connected on channel: ${selectedChannel}`);
      socket.emit('join_channel', { channel: selectedChannel, username: username });
    });

    socket.on("receive_message", (data) => {
      console.log(data);
      if (data.channel === selectedChannel && data.author !== username) {
        setMessageList((list) => [...list, data]);
      }
    });

    socket.on("channel_created", (channel) => {
      setChannels((prevChannels) => [...prevChannels, channel]);
      setNewUser("Server");
      setShowAlert(true);
      setSelectedChannel(channel);
    });

    socket.on("join_channel", (data) => {
      if (data.channel === selectedChannel) {
        setNewUser(data.username);
        setShowAlert(true);
      }
    });

    socket.on("update_channels", (updateChannels) => {
      setChannels(updateChannels);
    });

    socket.on("channel_name_updated", (data) => {
      const { oldName, newName } = data;
      setChannels((prevChannels) => prevChannels.map((channel) => {
        if (channel === oldName) {
          return newName;
        }
        return channel;
      }));
      if (selectedChannel === oldName) {
        setSelectedChannel(newName);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.emit('disconnect_channel', { channel: selectedChannel });
      console.log(`User ${username} disconnected on channel: ${selectedChannel}`);
    };
  }, [selectedChannel, username]);

  useEffect(() => {
    if (!isUserConnected) {
      socket.emit('join_channel', { channel: selectedChannel, username: username });
      setIsUserConnected(true);
    }
  }, [selectedChannel, username, isUserConnected]);

  const createChannel = () => {
    const channelName = prompt("Channel name:");
    if (channelName && !channels.includes(channelName)) {
      setChannels((prevChannels) => [...prevChannels, channelName]);
      setCurrentChannel(channelName);
      socket.emit('create_channel', { channel: channelName });
      console.log(`${username} just created channel: ${channelName}`);

      const createChannelMessage = {
        channel: channelName,
        author: "Server",
        message: `${username} just created channel : ${channelName}`,
        time: new Date().toLocaleDateString(),
      };

      setMessageList((list) => [...list, createChannelMessage]);
      setNewChannel(channelName);
      setShowCreateChannelAlert(true);

      setSelectedChannel(channelName);
    }
  };

  const removeChannel = (channelName) => {
    socket.emit('remove_channel', { channel: channelName });
    console.log(`User ${username} removed channel: ${channelName}`);

    const removeChannelMessage = {
      channel: selectedChannel,
      author: "Server",
     message: `${username} removed channel: ${channelName}`,
      time: new Date().toLocaleTimeString(),
    };

    setRemoveChannelAlert(true);
    setMessageList((list) => [...list, removeChannelMessage]);

    if (selectedChannel === channelName) {
      setSelectedChannel("General");
      setCurrentChannel("General");
      socket.emit('leave_channel', { channel: channelName });
      console.log(`User disconnected from channel: ${channelName}`);
    }
  };


  const editChannelName = () => {
    setShowEditModal(true);
    setEditChannel(selectedChannel);
  };

  const updateChannelName = () => {
    if (editChannel !== "") {
      socket.emit('update_channel_name', { oldName: selectedChannel, newName: editChannel });
      setSelectedChannel(editChannel);
      setShowEditModal(false);
    }
  };

  const changeChannel = (newChannel) => {
    console.log(`User disconnected on channel: ${currentChannel}`);
    socket.emit('leave_channel', {channel: currentChannel});

    setSelectedChannel(newChannel);
    setCurrentChannel(newChannel);
    setShowChannels(false);
    setMessageList([]);
    setNewUser(username);
    console.log(`User connected on channel: ${newChannel}`);

    setIsUserConnected(false);

    socket.emit('join_channel', { channel: newChannel, username: username });
    setShowAlert(true);
  };

  return (
    <div className='chat-container'>
      <div className='channels'>
        <Button
          className='btn btn-primary'
          type='button'
          onClick={() => setShowChannels(true)}
        >
          Channels
        </Button>
        <Offcanvas
          placement='start'
          scroll={true}
          show={showChannels}
          onHide={() => setShowChannels(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Channels</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ul className='list-unstyled'>
              {channels.map((channelName) => (
                <li key={channelName} className='mb-1'>
                  <span
                    onClick={() => changeChannel(channelName)}
                    style={{ cursor: 'pointer' }}
                  >
                    # {channelName}
                  </span>
                  <Button
                    className='btn btn-sm btn-danger ms-2'
                    onClick={() => removeChannel(channelName)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <Button className='btn btn-primary' onClick={createChannel}>
              Add Channel
            </Button>
            {selectedChannel !== "General" && (
              <div className="mt-3">
                <Button className='btn btn-secondary' onClick={editChannelName}>
                  Edit Channel Name
                </Button>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <div className='card chat-window'>
        <div className='chat-header'>
          <p>Live Chat - #{selectedChannel}</p>
        </div>
        <div className='message-container'>
          {messageList.map((messageContent, index) => {
            const isSentByCurrentUser = messageContent.author === username;
            const messageClassName = isSentByCurrentUser ? 'sent' : 'received';

            return (
              <div key={index} className={`message ${messageClassName}`}>
                <div>
                  <div className={`message-content ${messageClassName}`}>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p>{messageContent.time}</p>
                    <p>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <p className={showAlert ? 'alert' : 'hide-alert'}>
            <b>{newUser && `${newUser} just arrived on channel: ${selectedChannel}! Say hi`}</b>
          </p>
          <p className={showCreateChannelAlert ? 'alert' : 'hide-alert'}>
            {newUser && `${newUser} just created channel: ${newChannel}`}
          </p>
          <p className={removeChannelAlert ? 'alert' : 'hide-alert'}>
            {newUser && `${newUser} removed channel: ${selectedChannel}`}
          </p>
        </div>
        <div className='chat-input'>
          <input
            type='text'
            placeholder='Hello...'
            value={currentMessage}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
          />
        </div>
      </div>

      <div
        className={`modal fade ${showEditModal ? 'show' : ''}`}
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>Edit Channel Name</h5>
              <button
                type='button'
                className='btn-close'
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <div className='modal-body'>
              <input
                type='text'
                className='form-control'
                value={editChannel}
                onChange={(e) => setEditChannel(e.target.value)}
              />
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={updateChannelName}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
