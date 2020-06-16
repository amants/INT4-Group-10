import Head from 'next/head';
import React /*, { useEffect, useState } */ from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

const Home = ({ userStore }) => {
  // const [messages, setMessages] = useState([]);
  // const [players, setPlayers] = useState([]);
  // const [inRoom, setInRoom] = useState(false);

  // useEffect(() => {
  //   if (inRoom) {
  //     socket.emit('join room', { lobby_id: 16 });
  //   }

  //   return () => {
  //     if (inRoom) {
  //       console.log('leaving room');
  //       socket.emit('leave room', {
  //         lobby_id: 16,
  //       });
  //     }
  //   };
  // }, [inRoom]);

  // useEffect(() => {
  //   setInRoom(true);
  //   socket.on('initial messages', (payload) => {
  //     setMessages(payload.chats);
  //     document.title = `new messages have been emitted`;
  //   });
  //   socket.on('receive message', (payload) => {
  //     console.log('new message', payload);
  //     setMessages((prevValue) => [...prevValue, payload]);
  //     document.title = `new messages have been emitted`;
  //   });
  //   socket.on('system message', (payload) => {
  //     setMessages((prevValue) => [...prevValue, payload]);
  //     document.title = `new messages have been emitted`;
  //   });
  //   socket.on('playerCountUpdate', (payload) => {
  //     console.log('new message', payload);
  //     setPlayers(payload.users);
  //     document.title = `new messages have been emitted`;
  //   });
  // }, []);

  // const handleInRoom = () => {
  //   inRoom ? setInRoom(false) : setInRoom(true);
  // };

  // const handleNewMessage = (e) => {
  //   e.preventDefault();
  //   socket.emit('new message', {
  //     lobby_id: 16,
  //     message: `message ${messages.length + 1}`,
  //   });
  // };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          {/* {inRoom && `You Have Entered The Room`}
          {!inRoom && `Outside Room`} */}
        </h1>
        {/* <p>{messages.length} messages have been emitted</p> */}
        <div>
          <h1>Messages</h1>
          {/* {messages.map((item, i) => (
            <p key={i}>
              {item.username}: {item.message}
            </p>
          ))} */}
        </div>
        <div>
          <h1>Players</h1>
          {/* {players.map((item, i) => (
            <p key={i}>{item.username}</p>
          ))} */}
        </div>
        {/* {inRoom && (
          <button onClick={(e) => handleNewMessage(e)}>Emit new message</button>
        )} */}
        {/* <button onClick={() => handleInRoom()}>
          {inRoom && `Leave Room`}
          {!inRoom && `Enter Room`}
        </button> */}
      </main>
    </div>
  );
};

export default inject('userStore')(observer(Home));
