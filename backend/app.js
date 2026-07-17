const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

require("./scheduler/monitoringCron");

const serviceRoutes = require("./routes/serviceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const socket = require("./socket/socket");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/services", serviceRoutes);
app.use("/dashboard", dashboardRoutes);

const server = http.createServer(app);

socket.init(server);

server.listen(process.env.PORT, () => {
  console.log("Server Running");
});