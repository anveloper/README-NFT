import http from "http";
import SocketIO from "socket.io";
import express from "express";
import cors from "cors";

const PORT = 5000;
const app = express();

const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "https://j7b108.p.ssafy.io"],
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
      const cnt = rooms.get(key).size;
      const host = rooms.get(key)["host"];
      const data = {
        title: key,
        host: host,
        cnt: cnt,
      };
      publicRooms.push(data);
    }
  });
  return JSON.stringify(publicRooms);
};

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  // common
  const { rooms } = io.sockets.adapter;
  socket["nickname"] = "none";
  socket.emit("init_room", publicRooms());
  socket.onAny((event) => {
    console.log(`SocketIO Event: ${event}`);
  });

  // room
  socket.on("enter_room", (userAddress, nickname, roomName, done) => {
    socket["nickname"] = nickname;
    socket.join(roomName);
    const cnt = countRoom(roomName);
    if (cnt === 1) {
      rooms.get(roomName)["host"] = userAddress;
      done(roomName, countRoom(roomName), rooms.get(roomName)["host"]);
    } else {
      done(roomName, countRoom(roomName), rooms.get(roomName)["host"]);
    }
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("leave_room", (roomName) => {
    socket.leave(roomName);
    socket.to(roomName).emit("bye", socket.nickname, countRoom(roomName) - 1);
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.leave(room);
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  // chat
  socket.on("new_message", (room, msg, done) => {
    socket.to(room).emit("new_message", socket.nickname, msg);
    // console.log("NewMessage", `${room}: ${msg}`);
    done(msg);
  });
  socket.on("set_answer", (roomName, answer) => {
    rooms.get(roomName)["answer"] = answer;
    rooms.get(roomName)["solver"] = "";
  });
  socket.on("get_answer", (roomName) =>
    socket.emit(
      "send_answer",
      rooms.get(roomName)["answer"] ?? "아직 정답이 등록되지 않았습니다."
    )
  );
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

const handleListen = (err) =>
  err
    ? console.log(err)
    : console.log(`Listening on.. http://localhost:${PORT}`);
server.listen(PORT, handleListen);
