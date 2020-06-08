import Head from "next/head";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Home = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inRoom, setInRoom] = useState(false);

  console.log(messages);

  useEffect(() => {
    if (inRoom) {
      console.log("joining room");
      socket.emit("room", { room: "test-room" });
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
    socket.on("receive message", (payload) => {
      console.log("new message", payload);
      setMessageCount((prevValue) => prevValue + 1);
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `${messageCount} new messages have been emitted`;
    });
  }, []);

  const handleInRoom = () => {
    inRoom ? setInRoom(false) : setInRoom(true);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    console.log("emitting new message");
    socket.emit("new message", {
      room: "test-room",
      message: `message ${messageCount + 1}`,
    });
    setMessageCount(messageCount + 1);
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
        <p>{messageCount} messages have been emitted</p>
        <div>
          <h1>Messages</h1>
          {messages.map((item) => (
            <p key={item.message}>{item.message}</p>
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
