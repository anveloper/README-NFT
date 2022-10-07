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
const getParticipants = (session) => {
  const se = io.sockets.adapter.rooms.get(session);
  const result = [];
  se?.forEach((s) => {
    const { id, nickname, address } = io.sockets.sockets.get(s);
    result.push({ socketId: id, nickname, address });
  });
  return JSON.stringify(result);
};
const devFlag = process.env.NODE_ENV !== "production";
let i = 0;

io.on("connection", (socket) => {
  if (devFlag) console.log(i++, socket.id);
  // common
  const { rooms } = io.sockets.adapter;
  socket["nickname"] = "none";
  socket["solved"] = false;
  socket.emit("init_room", publicRooms());

  if (devFlag)
    socket.onAny((event) => {
      console.log(`SocketIO Event: ${event}`);
    }); // 모든 이벤트 리스너
  // noti;
  const notiSend = (session, msg, color) => {
    socket.to(session).emit("noti_send", msg, color);
    socket.emit("noti_send", msg, color);
  };
  // room
  socket.on("init_room", () => socket.emit("init_room", publicRooms()));
  socket.on("enter_room", (userAddress, nickname, roomTitle, done) => {
    console.log(userAddress);
    socket["address"] = userAddress;
    socket["nickname"] = nickname;
    const session = userAddress;
    socket.join(session);
    rooms.get(session)["title"] = roomTitle;
    rooms.get(session)["started"] = false;
    rooms.get(session)["answer"] = "";
    rooms.get(session)["solver"] = "";
    rooms.get(session)["data"] = [];
    done(
      rooms.get(session)["title"],
      countRoom(session) - 1,
      session,
      getParticipants(session)
    );
    socket.emit(
      "welcome",
      socket.nickname,
      countRoom(session) - 1,
      getParticipants(session)
    );
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
      rooms.get(session)["answer"]?.length,
      getParticipants(session)
    );
    socket
      .to(session)
      .emit(
        "welcome",
        socket.nickname,
        countRoom(session) - 1,
        getParticipants(session)
      );
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("leave_room", (session) => {
    socket.leave(session);
    socket
      .to(session)
      .emit(
        "bye",
        socket.nickname,
        countRoom(session) - 1,
        getParticipants(session)
      );
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((session) => {
      socket.leave(session);
      socket
        .to(session)
        .emit(
          "bye",
          socket.nickname,
          countRoom(session) - 1,
          getParticipants(session)
        );
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  // chat
  socket.on("new_message", (session, msg, done) => {
    console.log(socket["nickname"]);
    const answer = rooms.get(session)?.["answer"];
    if (answer && msg.includes(answer)) {
      if (!rooms.get(session)["solver"]) {
        rooms.get(session)["solver"] = socket["address"];
        notiSend(session, "최초 정답자가 나왔습니다!", "green");
      }
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
    rooms.get(session)["data"] = [];
    socket.join("solvers::" + session);
    done(answer);
    notiSend(session, "제시어가 생성되었습니다.", "#FF713E");
  });
  socket.on("reset_answer", (session) => {
    if (socket["solved"]) socket.leave("solvers::" + session);
    socket["solved"] = false;
    socket.join(session);
    socket.emit(
      "solve_cnt",
      rooms.get(session)?.["solver"],
      countSolvers(session) - 1,
      countRoom(session) - 1
    );
  });
  socket.on("get_answer", (session) =>
    socket.emit("send_answer", rooms.get(session)["answer"] ?? "unknown")
  );
  socket.on("get_solver", (session) => {
    socket.emit("send_solver", rooms.get(session)?.["solver"]);
  });
  socket.on("game_start", (session) => {
    rooms.get(session)["started"] = true;
    socket.emit("reset_draw");
    socket.to(session).emit("reset_draw");
    socket.to(session).emit("game_start");
    notiSend(session, "게임이 시작되었습니다.", "#FDDF61");
  });
  socket.on("draw_data", (session, data) => {
    socket.to(session).emit("draw_data", data);
    const dataList = rooms.get(session)?.["data"];
    if (rooms.get(session)?.["started"]) dataList.push(data);
  });
  socket.on("get_data", (session) => {
    socket.emit("set_data", JSON.stringify(rooms.get(session)?.["data"]));
    if (rooms.get(session)?.["started"])
      socket.emit("game_start", rooms.get(session)?.["answer"]);
  });
  socket.on("reset_canvas", (session) => {
    rooms.get(session)["data"] = [];
    socket.emit("reset_draw");
    socket.to(session).emit("reset_draw");
    notiSend(session, "캔버스가 초기화되었습니다.", "#FDDF61");
  });
  socket.on("timer_start", (session, time) => {
    socket.to(session).emit("timer_start", time);
    notiSend(session, "제한 시간이 시작되었습니다.", "#D93D04");
  });
  socket.on("game_end", (session, done) => {
    socket.to(session).emit("host_leave");
    done(rooms.get(session)?.["answer"], rooms.get(session)?.["solver"]);
  });

  // test code
  socket.on("test_join_room", ({ userAddress, nickname, hostAddress }) => {
    socket["address"] = userAddress;
    socket["nickname"] = nickname;
    socket["solved"] = false;
    const session = hostAddress;
    socket.join(session);
    socket
      .to(session)
      .emit(
        "welcome",
        socket.nickname,
        countRoom(session) - 1,
        getParticipants(session)
      );
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("test_new_message", ({ session, msg }) => {
    const answer = rooms.get(session)["answer"];
    if (answer && msg.includes(answer)) {
      if (!rooms.get(session)["solver"]) {
        rooms.get(session)["solver"] = socket["address"];
        notiSend(session, "최초 정답자가 나왔습니다!", "green");
      }
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
  });
});

const handleListen = (err) =>
  err
    ? console.log(`Soket Error`, err)
    : console.log(`Listening on.. http://localhost:${PORT}`);
server.listen(PORT, handleListen);
