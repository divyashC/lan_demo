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

// const IP_ADDRESS = "10.2.22.180";
const interfaces = os.networkInterfaces();
let ipAddress = "";

Object.keys(interfaces).forEach((iface) => {
	interfaces[iface].forEach((ifaceInfo) => {
		if (ifaceInfo.family === "IPv4" && !ifaceInfo.internal) {
			ipAddress = ifaceInfo.address;
		}
	});
});

console.log(`IP address: ${ipAddress}`);

const PORT = process.env.PORT || 5000;

server.listen(PORT, ipAddress, () => {
	console.log(`Server running on ${ipAddress}:${PORT}`);
});
