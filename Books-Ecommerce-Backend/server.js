const app = require("./src/app");
const http = require("http");
const mongoose = require("mongoose");
const WebSocket = require("ws");

const {
  app: { port },
} = require("./src/v1/configs/config");

// const SocketServices = require()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// wss.on("connection", SocketServices.connection)

const PORT = port || 3055;

server.listen(PORT, () => {
  console.log(`Server is listening on port::${PORT}`);
});
