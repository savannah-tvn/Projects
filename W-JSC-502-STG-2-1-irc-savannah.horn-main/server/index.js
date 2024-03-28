const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

const server = http.createServer(app);
let connectedUser = new Set();
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let currentChannel = "";

let channels = [
  {
    name: 'General',
    messages: [],
  },
];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  connectedUser.add(socket.id);

  socket.on('join_channel', (data) => {
    const { channel, username } = data;
    socket.join(channel);
    console.log(`User with ID: ${socket.id} joined channel: ${channel}`);
    currentChannel = channel;
    
    const joinMessage = {
      channel,
      author: 'Server',
      message: `${username} has joined the channel.`,
      time: new Date().toLocaleTimeString(),
    };

    const currentChannelData = channels.find((c) => c.name === channel);
    if (currentChannelData) {
      currentChannelData.messages.forEach((message) => {
        socket.emit('receive_message', message);
      });
    }

    io.to(channel).emit('receive_message', joinMessage);
    io.in(channel).emit('join_channel', { channel, username });
    socket.emit('send_message', joinMessage);
  });

  socket.on('send_message', (data) => {
    const { channel, author, message, time } = data;
    console.log(data);
    const messageData = {
      channel,
      author,
      message,
      time,
    };

    currentChannel = channel;

    const currentChannelData = channels.find((c) => c.name === channel);
    if (currentChannelData) {
      currentChannelData.messages.push(messageData);
    }

    io.to(channel).emit('receive_message', messageData);
  });

  socket.on('create_channel', (data) => {
    const { channel } = data;
    channels.push({ name: channel, messages: [] });
    console.log(`User created new channel: ${channel}`);
    io.emit('channel_created', channel);
    io.emit('update_channels', channels.map((c) => c.name)); 

    const createChannelMessage = {
      channel,
      author: 'Server',
      message: `${channel} has been created.`,
      time: new Date().toLocaleTimeString(),
    };
    io.to(channel).emit('receive_message', createChannelMessage);
  });

  socket.on('remove_channel', (data) => {
    const { channel } = data;
    channels = channels.filter((c) => c.name !== channel);
    console.log(`User removed channel: ${channel}`);
    io.emit('channel_removed', channel);
    io.emit('update_channels', channels.map((c) => c.name)); 

    const removeChannelMessage = {
      channel,
      author: 'Server',
      message: `${channel} has been removed.`,
      time: new Date().toLocaleTimeString(),
    };
    io.to(channel).emit('receive_message', removeChannelMessage);
  });

  socket.on('update_channel_name', (data) => {
    const { oldName, newName } = data;
    const channel = channels.find((c) => c.name === oldName);
    if (channel) {
      channel.name = newName;
      io.emit('channel_name_updated', { oldName, newName });
      io.emit('update_channels', channels.map((c) => c.name));
    }
  });

  socket.on('change_nickname', ({ nickname }) => {
    const userChannel = findUserChannel(socket.id);
    if (userChannel) {
      const messageData = {
        channel: userChannel.name,
        author: nickname,
        message:  `${socket.username} changed nickname to ${nickname}`,
        time: new Date().toLocaleDateString(),
      };

      userChannel.messages.push(messageData);
      io.to(userChannel.name).emit('receive_message', messageData);
    }
    socket.username = nickname;
  });
  
  socket.on('disconnect', () => {
    connectedUser.delete(socket.id);
    console.log(`User ${socket.id} disconnected`);

    socket.leave(currentChannel);
    console.log(`User disconnected from channel: ${currentChannel}`);

    currentChannel = "";
  });
});

app.get('/channels', (req, res) => {
  res.json(channels.map((c) => c.name));
});

server.listen(3001, () => {
  console.log('Server Running on port 3001');
});

function findUserChannel(socketId) {
  const channel = channels.find((c) => c.messages.some((message) => message.author === socketId));
  return channel;
}
