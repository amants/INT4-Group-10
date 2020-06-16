import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Home = ({ userStore, partyId }) => {
  const [messages, setMessages] = useState([]);
  const [ready, setReady] = useState(false);
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
    console.log({ ready });
    socket.emit('ready', { lobby_id: partyId, ready });

    return () => {
      socket.emit('ready', {
        lobby_id: partyId,
        ready: false,
      });
    };
  }, [ready]);

  useEffect(() => {
    setInRoom(true);
    socket.on('initial messages', (payload) => {
      setMessages(payload.chats);
      setPlayers(payload.members);
      setQuiz(payload.quiz);
      console.log(payload.quiz);
      document.title = `new messages have been emitted`;
    });
    socket.on('receive message', (payload) => {
      console.log('new message 1', payload);
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
      console.log('new message 2', payload);
      setPlayers(payload.members);
    });
    socket.on('ready error', (payload) => {
      console.log('Ready error', payload);
    });
    socket.on('status update', (payload) => {
      console.log('status update', payload);
      if (payload.quiz.status === 1) alert('quiz starting');
    });
  }, []);

  const handleReady = () => {
    setReady((prevValue) => !prevValue);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    socket.emit('new message', {
      lobby_id: partyId,
      message: `message ${messages.length + 1}`,
    });
  };

  const handleStart = (e) => {
    e.preventDefault();
    socket.emit('start game', {
      lobby_id: partyId,
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
              {item.username} - {item.online ? 'online' : 'offline'} -{' '}
              {item.ready ? 'Ready' : 'waiting ...'}
            </p>
          ))}
        </div>
        <br />
        <div>
          {inRoom && (
            <button onClick={handleNewMessage}>Emit new message</button>
          )}
        </div>
        <br />
        <div>
          <button onClick={handleReady}>
            {ready && `Unready`}
            {!ready && `Ready`}
          </button>
        </div>
        <br />
        {quiz?.leader?.id === userStore.user.id ? (
          <div>
            <button onClick={handleStart}>Start game</button>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { partyId: params.partyId } };
}

export default inject('userStore')(observer(Home));
