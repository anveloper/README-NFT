import http from "http";
import SocketIO from "socket.io";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (!sids.get(key)) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

const answers = [];

io.on("connection", (socket) => {
  socket["nickname"] = "none";
  socket.emit("init_room", publicRooms());
  socket.onAny((event) => {
    console.log(`SocketIO Event: ${event}`);
  });
  socket.on("enter_room", (nickname, roomName, done) => {
    socket["nickname"] = nickname;
    socket.join(roomName);
    done(roomName, countRoom(roomName));
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("leave_room", (roomName, done) => {
    socket.leave(roomName);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (room, msg, done) => {
    socket.to(room).emit("new_message", socket.nickname, msg);
    done(msg);
  });
  socket.on("set_answer", (roomName, answer) => (answers[roomName] = answer));
  socket.on("get_answer", (roomName) =>
    socket.emit("send_answer", answers[roomName] ?? "미정")
  );
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

const handleListen = (err) =>
  err
    ? console.log(err)
    : console.log(`Listening on.. http://localhost:${PORT}`);
server.listen(PORT, handleListen);
