require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT_ORIGIN1, process.env.CLIENT_ORIGIN2],
    methods: ["GET", "POST"],
  },
});

const groups = [{ id: 1, members: ["User1", "User2", "User3", "User4", "User5", "User6", "User7", "User8", "User9", "User10"] }];
let groupIdCounter = 2;

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("updateGroups", groups);

  socket.on("addGroup", () => {
    const newGroup = { id: groupIdCounter++, members: [] };
    groups.push(newGroup);
    io.emit("updateGroups", groups);
  });

  socket.on("deleteGroup", (groupId) => {
    const groupIndex = groups.findIndex((group) => group.id === groupId);
    if (groupIndex !== -1 && groups[groupIndex].members.length === 0) {
      groups.splice(groupIndex, 1);
      io.emit("updateGroups", groups);
    }
  });

  socket.on("moveMember", ({ memberId, newGroupId }) => {
    for (let group of groups) {
      const index = group.members.indexOf(memberId);
      if (index > -1) group.members.splice(index, 1);
    }
    const targetGroup = groups.find((g) => g.id === newGroupId);
    if (targetGroup) targetGroup.members.push(memberId);

    io.emit("updateGroups", groups);
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
