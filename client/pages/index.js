import Head from "next/head";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [inRoom, setInRoom] = useState(false);

  console.log(messages);

  useEffect(() => {
    if (inRoom) {
      console.log("joining room");
      socket.emit("join room", { room: 1 });
    }

    return () => {
      if (inRoom) {
        console.log("leaving room");
        socket.emit("leave room", {
          room: "test-room",
        });
      }
    };
  }, [inRoom]);

  useEffect(() => {
    socket.on("initial messages", (payload) => {
      console.log(payload);
      setMessages(payload.chats);
      document.title = `new messages have been emitted`;
    });
    socket.on("receive message", (payload) => {
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `new messages have been emitted`;
    });
    socket.on("system message", (payload) => {
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `new messages have been emitted`;
    });
    socket.on("playerCountUpdate", (payload) => {
      console.log("new message", payload);
      setPlayers(payload.users);
      document.title = `new messages have been emitted`;
    });
  }, []);

  const handleInRoom = () => {
    inRoom ? setInRoom(false) : setInRoom(true);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    socket.emit("new message", {
      lobby_id: 1,
      token: `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJleGFuaSIsImVtYWlsIjoicmV4QGFtYXRudG52LmJlIiwiaWF0IjoxNTkxODc0Njc1LCJhdWQiOiJodHRwczovL25lb2xvbC5jb20iLCJpc3MiOiJIdWdlQ2xvbmUiLCJzdWIiOiJSZXhhbmkifQ.WWpr5gUtbBHhRmgg6fc3eHKbQ-qSCtqmYyZbFDpWtfwbZpIaG2KmVvGZp9PtAe00H-npRt11HHMK_lTuGkB0gQ`,
      message: `message ${messages.length + 1}`,
    });
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          {inRoom && `You Have Entered The Room`}
          {!inRoom && `Outside Room`}
        </h1>
        <p>{messages.length} messages have been emitted</p>
        <div>
          <h1>Messages</h1>
          {messages.map((item, i) => (
            <p key={i}>
              {item.username}: {item.message}
            </p>
          ))}
        </div>
        <div>
          <h1>Players</h1>
          {players.map((item, i) => (
            <p key={i}>{item.username}</p>
          ))}
        </div>
        {inRoom && (
          <button onClick={(e) => handleNewMessage(e)}>Emit new message</button>
        )}
        <button onClick={() => handleInRoom()}>
          {inRoom && `Leave Room`}
          {!inRoom && `Enter Room`}
        </button>
      </main>
    </div>
  );
};

export default Home;
