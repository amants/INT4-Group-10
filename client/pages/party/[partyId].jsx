import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Home = ({ userStore, partyId }) => {
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [error, setError] = useState(false);
  const [inRoom, setInRoom] = useState(true);

  useEffect(() => {
    if (inRoom) {
      socket.emit('join room', { lobby_id: partyId });
    }

    return () => {
      if (inRoom) {
        socket.emit('leave room', {
          lobby_id: 16,
        });
      }
    };
  }, [inRoom]);

  useEffect(() => {
    setInRoom(true);
    socket.on('initial messages', (payload) => {
      setMessages(payload.chats);
      setPlayers(payload.members);
      setQuiz(payload.quiz);
      document.title = `new messages have been emitted`;
    });
    socket.on('receive message', (payload) => {
      console.log('new message', payload);
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `new messages have been emitted`;
    });
    socket.on('errormsg', (payload) => {
      setError(payload.error);
    });
    socket.on('system message', (payload) => {
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `new messages have been emitted`;
    });
    socket.on('player update', (payload) => {
      console.log('new message', payload);
      setPlayers(payload.members);
    });
  }, []);

  const handleInRoom = () => {
    inRoom ? setInRoom(false) : setInRoom(true);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    console.log('new message');
    socket.emit('new message', {
      lobby_id: partyId,
      message: `message ${messages.length + 1}`,
    });
  };

  if (error) {
    return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <h1>{error}</h1>
        </main>
      </div>
    );
  }

  if (!userStore.auth) {
    return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <h1>Not logged in</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          {quiz?.name} - {userStore.user.username}
        </h1>
        <br />
        <div>
          <h1>Messages</h1>
          {messages.map((item, i) => (
            <p key={i}>
              {item.username}: {item.message}
            </p>
          ))}
        </div>
        <br />
        <div>
          <h1>Players</h1>
          {players.map((item, i) => (
            <p key={i}>
              {item.username} - {item.online ? 'online' : 'offline'}
            </p>
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

export async function getServerSideProps({ params }) {
  return { props: { partyId: params.partyId } };
}

export default inject('userStore')(observer(Home));
