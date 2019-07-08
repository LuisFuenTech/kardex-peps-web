if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { server } = require("./config/index");

const socketIO = require("socket.io");
const io = socketIO(server);

io.on("connection", socket => {
  console.log(`New connection: ${socket.id}`);

  //Recibe datos de cliente y reenvía
  socket.on("client:costo", data => {
    io.sockets.emit("server:costo", data.costo);
    socket.broadcast.emit("server:msg", `${socket.id} is typing...`);

    console.log(data);
  });

  socket.on("client:kardex", data => {
    io.sockets.emit("server:kardex", data);
  });

  socket.on("chat:typing", data => {
    socket.broadcast.emit("server:type", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
