const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const ACTIONS = require("./src/actions.js");

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = 5000;

const userIdMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    socketId => {
      return { socketId, username: userIdMap[socketId] };
    }
  );
}

io.on("connection", socket => {
  //console.log("socket connected", socket);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userIdMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach(roomId => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userIdMap[socket.id]
      });
    });
    delete userIdMap[socket.id];
    socket.leave();
  });
});

server.listen(PORT, () => {
  console.log("Listening on", PORT);
});
