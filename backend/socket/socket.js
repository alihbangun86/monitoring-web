const { Server } = require("socket.io");

let io;

function init(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  init,
  getIO,
};