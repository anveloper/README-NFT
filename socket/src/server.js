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
      const title = rooms.get(key)["title"];
      const data = {
        host: key,
        title: title,
        cnt: cnt,
      };
      publicRooms.push(data);
    }
  });
  return JSON.stringify(publicRooms);
};

const countRoom = (session) => {
  return io.sockets.adapter.rooms.get(session)?.size;
};

io.on("connection", (socket) => {
  // common
  const { rooms } = io.sockets.adapter;
  socket["nickname"] = "none";
  socket.emit("init_room", publicRooms());

  // socket.onAny((event) => {
  //   console.log(`SocketIO Event: ${event}`);
  // }); // 모든 이벤트 리스너

  // room
  socket.on("enter_room", (userAddress, nickname, roomTitle, done) => {
    socket["nickname"] = nickname;
    socket["address"] = userAddress;
    const session = userAddress;
    socket.join(session);
    rooms.get(session)["title"] = roomTitle;
    rooms.get(session)["data"] = [];
    done(rooms.get(session)["title"], countRoom(session), session);
    socket.to(session).emit("welcome", socket.nickname, countRoom(session));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("join_room", (userAddress, nickname, hostAddress, done) => {
    socket["nickname"] = nickname;
    socket["address"] = userAddress;
    const session = hostAddress;
    socket.join(session);
    done(rooms.get(session)["title"], countRoom(session), session);
    socket.to(session).emit("welcome", socket.nickname, countRoom(session));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("leave_room", (session) => {
    socket.leave(session);
    socket.to(session).emit("bye", socket.nickname, countRoom(session) - 1);
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((session) => {
      socket.leave(session);
      socket.to(session).emit("bye", socket.nickname, countRoom(session) - 1);
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  // chat
  socket.on("new_message", (session, msg, done) => {
    socket.to(session).emit("new_message", socket.nickname, msg);
    // console.log("NewMessage", `${room}: ${msg}`);
    done(msg);
  });
  socket.on("set_answer", (session, answer) => {
    rooms.get(session)["answer"] = answer;
    rooms.get(session)["solver"] = "";
  });
  socket.on("get_answer", (session) =>
    socket.emit(
      "send_answer",
      rooms.get(session)["answer"] ?? "아직 정답이 등록되지 않았습니다."
    )
  );
  socket.on("draw_data", (session, data) => {
    // rooms.get(session)["data"].push(data);
    const dataList = rooms.get(session)["data"];
    dataList.push(data);
    socket.to(session).emit("draw_data", data);
  });
  socket.on("reset_canvas", (session) => {
    rooms.get(session)["data"] = [];
    socket.emit("reset_draw");
    socket.to(session).emit("reset_draw");
  });
});

const handleListen = (err) =>
  err
    ? console.log(err)
    : console.log(`Listening on.. http://localhost:${PORT}`);
server.listen(PORT, handleListen);
