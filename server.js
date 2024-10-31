require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 200 // 일부 브라우저 호환성 해결
};

// Express에서 CORS 설정
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const server = http.createServer(app);

// Socket.IO의 CORS 설정을 동일하게 적용
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS 헤더 수동 설정 미들웨어
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN);
  res.header("Access-Control-Allow-Credentials", "true");
  console.log("CORS headers set for", req.path);
  next();
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