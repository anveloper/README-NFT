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
      const scnt = rooms.get("solvers::" + key)?.size | 0;
      const data = {
        host: key,
        title: title,
        cnt: cnt,
        scnt: scnt,
      };
      if (title) publicRooms.push(data);
    }
  });
  return JSON.stringify(publicRooms);
};

const countRoom = (session) => {
  return io.sockets.adapter.rooms.get(session)?.size;
};
const countSolvers = (session) => {
  return io.sockets.adapter.rooms.get("solvers::" + session)?.size;
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
    socket["address"] = userAddress;
    socket["nickname"] = nickname;
    const session = userAddress;
    socket.join(session);
    rooms.get(session)["title"] = roomTitle;
    rooms.get(session)["started"] = false;
    rooms.get(session)["answer"] = "";
    rooms.get(session)["solver"] = "";
    rooms.get(session)["data"] = [];
    done(rooms.get(session)["title"], countRoom(session) - 1, session);
    socket.to(session).emit("welcome", socket.nickname, countRoom(session) - 1);
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("join_room", (userAddress, nickname, hostAddress, done) => {
    socket["address"] = userAddress;
    socket["nickname"] = nickname;
    socket["solved"] = false;
    const session = hostAddress;
    socket.join(session);
    done(
      rooms.get(session)["title"],
      countRoom(session) - 1,
      session,
      rooms.get(session)["answer"].length
    );
    socket.to(session).emit("welcome", socket.nickname, countRoom(session) - 1);
    io.sockets.emit("room_change", publicRooms());
    // if (rooms.get(session)["started"]) {
    //   socket.emit("game_start");
    //   socket.emit("set_data", JSON.stringify(rooms.get(session)["data"]));
    // }
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
    const answer = rooms.get(session)["answer"];
    if (answer && msg.includes(answer)) {
      if (!rooms.get(session)["solver"])
        rooms.get(session)["solver"] = socket["address"];
      socket.join("solvers::" + session);
      socket["solved"] = true;
      socket
        .to(session)
        .emit(
          "solve_cnt",
          rooms.get(session)["solver"],
          countSolvers(session) - 1,
          countRoom(session) - 1
        );
      socket.emit(
        "solve_cnt",
        rooms.get(session)["solver"],
        countSolvers(session) - 1,
        countRoom(session) - 1
      );
    }
    if (!socket["solved"]) {
      socket.to(session).emit("new_message", socket.nickname, msg);
    } else {
      socket
        .to("solvers::" + session)
        .emit("new_message", "익명의 정답자", msg);
    }
    done(msg);
  });
  socket.on("set_answer", (session, answer, done) => {
    rooms.get(session)["started"] = false;
    io.in(session).socketsLeave("solvers::" + session);
    socket.to(session).emit("reset_answer", answer.length);
    rooms.get(session)["solver"] = "";
    rooms.get(session)["answer"] = answer;
    socket.join("solvers::" + session);
    done(answer);
  });
  socket.on("reset_answer", (session) => {
    socket["solved"] = false;
    socket.leave("solvers::" + session);
    socket.join(session);
    socket
      .to(session)
      .emit(
        "solve_cnt",
        rooms.get(session)["solver"],
        countSolvers(session) - 1,
        countRoom(session) - 1
      );
    socket.emit(
      "solve_cnt",
      rooms.get(session)["solver"],
      countSolvers(session) - 1,
      countRoom(session) - 1
    );
  });
  socket.on("get_answer", (session) =>
    socket.emit(
      "send_answer",
      rooms.get(session)["answer"] ?? "아직 정답이 등록되지 않았습니다."
    )
  );
  socket.on("get_solver", (session) => {
    socket.emit(
      "send_solver",
      rooms.get(session)["solver"] ?? "아직 정답자가 없습니다."
    );
  });
  socket.on("game_start", (session) => {
    rooms.get(session)["started"] = true;
    socket.emit("reset_draw");
    socket.to(session).emit("reset_draw");
    socket.to(session).emit("game_start");
  });
  socket.on("draw_data", (session, data) => {
    // rooms.get(session)["data"].push(data);
    const dataList = rooms.get(session)["data"];
    if (rooms.get(session)["started"]) dataList.push(data);
    socket.to(session).emit("draw_data", data);
  });
  socket.on("get_data", (session) => {
    socket.emit("set_data", JSON.stringify(rooms.get(session)["data"]));
    if (rooms.get(session)["started"]) socket.emit("game_start");
  });
  socket.on("reset_canvas", (session) => {
    rooms.get(session)["data"] = [];
    socket.emit("reset_draw");
    socket.to(session).emit("reset_draw");
  });
  socket.on("timer_start", (session, time) => {
    socket.to(session).emit("timer_start", time);
  });
  socket.on("game_end", (session, done) => {
    socket.to(session).emit("host_leave");
    done(rooms.get(session)["answer"], rooms.get(session)["solver"]);
  });
});

const handleListen = (err) =>
  err
    ? console.log(err)
    : console.log(`Listening on.. http://localhost:${PORT}`);
server.listen(PORT, handleListen);
