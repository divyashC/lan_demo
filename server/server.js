const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const os = require("os");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "*",
	},
	transports: ["websocket", "polling"],
});

const dir = __dirname.split("/");
dir.pop();

app.use(cors());

app.get("/", (req, res) => {
	res.sendFile(dir.join("/") + "/react-client/public/index.html");
});

io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});

	socket.on("chat message", (msg) => {
		console.log("Message: " + msg);
		io.emit("chat message", msg);
	});
});

const PORT = process.env.PORT || 5000;
const interfaces = os.networkInterfaces();
let ipAddresses = [];

Object.keys(interfaces).forEach((iface) => {
	interfaces[iface].forEach((ifaceInfo) => {
		if (ifaceInfo.family === "IPv4" && !ifaceInfo.internal) {
			ipAddresses.push(ifaceInfo.address);
		}
	});
});

server.listen({ port: PORT, host: "0.0.0.0", addresses: ipAddresses }, () => {
	console.log(`Server running on ${ipAddresses.join(", ")}:${PORT}`);
});
