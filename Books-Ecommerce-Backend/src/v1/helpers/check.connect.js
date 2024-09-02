"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;

//count connetions
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of Connections::${numConnections}`);
};

//check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage:" ${memoryUsage / 1024 / 1024} MB`);

    //example maxium number of connections based  on number of cores
    const maxConnections = numCores * 50;
    if (numConnections > maxConnections - 100) {
      console.log(`Connections overload detected`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverLoad,
};
