import Head from 'next/head';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';
import Webcam from 'react-webcam';

const socket = io('http://localhost:5000');

const Home = ({ userStore, partyId }) => {
  const [messages, setMessages] = useState([]);
  const [ready, setReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [picture, setPicture] = useState(null);
  const [pictures, setPictures] = useState({});
  const [quiz, setQuiz] = useState({});
  const [showTakeAShot, setShowTakeAShot] = useState(false);
  const [showPlusPoints, setShowPlusPoints] = useState(false);
  const [error, setError] = useState(false);
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [inRoom, setInRoom] = useState(true);

  const videoConstraints = {
    width: 400,
    height: 600,
    facingMode: 'user',
  };

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPicture(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    if (inRoom) {
      socket.emit('join room', { lobby_id: parseInt(partyId) });
    }

    return () => {
      if (inRoom) {
        socket.emit('leave room', {
          lobby_id: parseInt(partyId),
        });
      }
    };
  }, [inRoom]);

  useEffect(() => {
    if (quiz?.current_question?.type === 'recipe') {
      setReady(false);
    }
    if (quiz?.current_question?.type === 'lobby') {
      setPictures({});
      setCorrectAnswerId(null);
      setAnswerId(null);
    }
  }, [quiz?.current_question?.type]);

  useEffect(() => {
    socket.emit('ready', { ready });

    return () => {
      socket.emit('ready', {
        ready: false,
      });
    };
  }, [ready]);

  useEffect(() => {
    if (showTakeAShot) {
      const timeout = setTimeout(() => {
        setShowTakeAShot(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showTakeAShot]);

  useEffect(() => {
    if (showPlusPoints) {
      const timeout = setTimeout(() => {
        setShowPlusPoints(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showPlusPoints]);

  useEffect(() => {
    if (answerId && correctAnswerId) {
      if (answerId !== correctAnswerId) {
        setShowTakeAShot(true);
      } else {
        setShowPlusPoints(true);
      }
    }
  }, [correctAnswerId]);

  useEffect(() => {
    setInRoom(true);
    socket.on('initial messages', (payload) => {
      setMessages(payload.chats);
      setPlayers(payload.members);
      setQuiz(payload.quiz);
      setPictures(payload.quiz.pictures);

      console.log(payload);
      document.title = `new messages have been emitted`;
    });
    socket.on('receive message', (payload) => {
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `new messages have been emitted`;
    });
    socket.on('errormsg', (payload) => {
      setError(payload.error);
    });

    socket.on('correct answer', (payload) => {
      setCorrectAnswerId(payload.correct_answer);
    });

    socket.on('system message', (payload) => {
      setMessages((prevValue) => [...prevValue, payload]);
      document.title = `new messages have been emitted`;
    });

    socket.on('player update', (payload) => {
      setPlayers(payload.members);
    });

    socket.on('pictures update', (payload) => {
      console.log(payload);
      setPictures(payload.pictures);
    });

    socket.on('ready error', (payload) => {
      console.log('Ready error', payload);
    });

    socket.on('status update', (payload) => {
      console.log('status update', payload);
      setQuiz((prevValue) => ({
        ...prevValue,
        ...payload,
      }));
    });
  }, []);

  const handleReady = () => {
    setReady((prevValue) => !prevValue);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    socket.emit('new message', {
      message: `message ${messages.length + 1}`,
    });
  };

  const handleStart = (e) => {
    e.preventDefault();
    socket.emit('start game', {
      lobby_id: partyId,
    });
  };

  const handlePicture = (e) => {
    e.preventDefault();
    socket.emit('upload picture', {
      picture,
    });
  };

  const handleAnswer = (e, answer_id) => {
    e.preventDefault();
    setAnswerId(answer_id);
    socket.emit('answer', {
      answer_id,
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
        {quiz?.current_question?.type === 'lobby' ? (
          <>
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
          </>
        ) : null}
        {quiz?.current_question?.type === 'quiz' ? (
          <>
            <h1>Quiz {quiz?.time_to_answer}</h1>
            <h2>{quiz?.current_question?.title}</h2>
            <h3>{quiz?.current_question?.description}</h3>
            {showTakeAShot ? <h5>TAKE A SHOT!!!</h5> : null}
            {showPlusPoints ? <h5>CORRECT!!! +20 points</h5> : null}
            <br />
            <div>
              {quiz?.current_question?.answers?.map((answer, i) => (
                <div key={i}>
                  <br />
                  <button
                    key={i}
                    onClick={(e) => handleAnswer(e, answer?.answer_id)}
                  >
                    {correctAnswerId === answer?.answer_id
                      ? 'correct -> '
                      : null}
                    {answer?.answer}
                  </button>{' '}
                  {quiz?.answered_questions?.[
                    quiz?.current_question?.question_id
                  ]?.[answer?.answer_id]?.map((item, j) => {
                    return <span key={j}> - {item.username}</span>;
                  })}
                  <br />
                </div>
              ))}
            </div>
            <div>
              <h1>Players</h1>
              {players.map((item, i) => (
                <p key={i}>
                  {item.username} - {item.online ? 'online' : 'offline'} -{' '}
                  score: {item.score} - shots: {item.shots}
                </p>
              ))}
            </div>
          </>
        ) : null}
        {quiz?.current_question?.type === 'recipe' ? (
          <>
            <h1>Recipe step unlocked: {quiz?.current_question?.step}</h1>
            <br />
            <div>
              <h2>{quiz?.current_question?.name}</h2>
              <h3>{quiz?.current_question?.description}</h3>
            </div>
            <br />
            <button onClick={handleReady}>
              {ready && `Unready`}
              {!ready && `Ready`}
            </button>
            <br />
            <br />
            <div>
              <h1>Players</h1>
              {players.map((item, i) => (
                <p key={i}>
                  {item.username} - {item.online ? 'online' : 'offline'} -{' '}
                  score: {item.score} - shots: {item.shots} -{' '}
                  {item.ready ? 'Ready' : 'waiting ...'}
                </p>
              ))}
            </div>
          </>
        ) : null}
        {quiz?.current_question?.type === 'end_screen' ? (
          !pictures?.[userStore.user.id] ? (
            <>
              <h1>Upload your picture </h1>
              <br />
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
              <button onClick={capture}>Take picture</button>
              <br />
              {picture ? <img src={picture} /> : ''}
              <br />
              <button onClick={handlePicture}>Continue</button>
              <br />
              <div>
                <h1>Players</h1>
                {players.map((item, i) => (
                  <p key={i}>
                    {item.username} - {item.online ? 'online' : 'offline'} -{' '}
                    score: {item.score} - shots: {item.shots} -{' '}
                    {item.ready ? 'Ready' : 'waiting ...'}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1>Post game lobby</h1>
              <br />
              <h2>Uploaded pictures:</h2>
              {Object.values(pictures).map((item) => (
                <div>
                  <img src={`http://localhost:5000/${item.src}`} />
                  <p>{item.username}</p>
                </div>
              ))}
              <br />
              <h2>Score:</h2>
              <button onClick={handleReady}>
                {ready && `Unready`}
                {!ready && `Ready`}
              </button>
              <div>
                <h1>Players</h1>
                {players.map((item, i) => (
                  <p key={i}>
                    {item.username} - {item.online ? 'online' : 'offline'} -{' '}
                    score: {item.score} - shots: {item.shots} -{' '}
                    {item.ready ? 'Ready' : 'waiting ...'}
                  </p>
                ))}
              </div>
            </>
          )
        ) : null}
      </main>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { partyId: params.partyId } };
}

export default inject('userStore')(observer(Home));
