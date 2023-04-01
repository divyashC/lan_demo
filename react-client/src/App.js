import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io(`http://${window.location.hostname}:5000`, {
	transport: ["websocket"],
});

function App() {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [userName, setUserName] = useState("");

	useEffect(() => {
		if (userName !== "") {
			socket.on("chat message", ({ userName, message }) => {
				setMessages([...messages, { userName, message }]);
			});
		}
	}, [userName, messages]);

	const handleSubmit = (event) => {
		event.preventDefault();
		socket.emit("chat message", { userName, message });
		setMessage("");
	};

	const handleNameSubmit = (event) => {
		event.preventDefault();
		setUserName(event.target.name.value);
	};

	return (
		<div className="flex flex-col w-full h-screen mx-auto my-auto sm:w-4/5 sm:h-4/5 md:w-70 md:h-90 chat-window">
			<h1 className="mt-10 text-2xl font-bold text-center text-gray-700">
				{userName === "" ? "Welcome to LAN Chat" : "LAN Chat"}
			</h1>
			{userName === "" ? (
				<form
					onSubmit={handleNameSubmit}
					className="flex flex-col max-w-md px-8 pt-6 pb-8 mx-auto my-48 rounded-md bg-gray-50"
				>
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Enter your name"
						className="w-full px-3 py-2 mb-5 leading-tight text-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Submit
					</button>
				</form>
			) : (
				<>
					<p className="mt-2 text-sm text-center text-gray-700">
						{userName === "" ? "" : `You are logged in as `}
						<span className="inline-flex items-center px-2 py-0.5 mr-2 text-xs font-bold leading-5 text-blue-800 bg-blue-100 rounded-full">
							{userName}
						</span>
					</p>
					<ul className="flex-1 p-4 overflow-y-scroll chat-messages ">
						{messages.map(({ userName: messageUserName, message }, index) => (
							<div key={index}>
								<li
									className={
										messageUserName === userName
											? "mb-1 text-sm text-gray-400 ml-auto w-fit"
											: "mb-1 text-sm text-gray-400 mr-auto w-fit"
									}
								>
									{messageUserName}
								</li>
								<li
									className={
										messageUserName === userName
											? "bg-blue-500 text-white rounded-2xl py-2 px-3 mb-3 ml-auto w-fit"
											: "bg-gray-100 rounded-2xl py-2 px-3 mb-3 mr-auto w-fit"
									}
								>
									{message}
								</li>
							</div>
						))}
					</ul>

					<form
						onSubmit={handleSubmit}
						className="flex items-center justify-center p-4"
					>
						<input
							className="flex-1 px-3 py-2 mr-2 bg-gray-100 rounded-full chat-input focus:outline-none focus:ring-2 focus:ring-blue-500"
							type="text"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder="Type a message..."
						/>
						<button
							className="px-4 py-2 text-white bg-blue-500 rounded-full chat-send-button hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
							type="submit"
						>
							Send
						</button>
					</form>
				</>
			)}
		</div>
	);
}

export default App;
