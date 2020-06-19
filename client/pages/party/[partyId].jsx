import Head from 'next/head';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';
import Webcam from 'react-webcam';
import style from './Style.module.css';

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
    <div className={style.container}>
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
            {/* Header */}
            <h1 className={style.hidden}>home</h1>
            <span className={[style.logo, style.h1].join(' ')}>
              Throw A Knife
            </span>

            {/* Quiz Container */}
            <div className={style.quiz__container}>
              <div className={style.quiz__header}>
                <span
                  className={[style.party__participants, style.h2].join(' ')}
                >
                  Participants {players.length}/6
                </span>
                <h1 className={[style.party__title, style.h1].join(' ')}>
                  {quiz.name} - {quiz?.time_to_answer}
                </h1>
              </div>
              {/* FRIENDSLIST */}
              <div className={style.quiz__sidebar}>
                <div className={style.sidebar__friends}>
                  {console.log(players, 'players')}
                  {players.map((item, i) => {
                    if (userStore.user.id == item.user_id) {
                      return (
                        // Show user that is current user
                        <>
                          <div
                            className={[
                              style.friends__userS,
                              style.friends__userself,
                            ].join(' ')}
                          >
                            <img
                              className={style.user__picture}
                              src="/assets/images/lara.jpg"
                              width="160"
                              height="160"
                              alt=""
                            />
                            <span
                              className={[style.user__name, style.t2].join(' ')}
                            >
                              score: {item.store}
                            </span>
                            <span
                              className={[style.user__country, style.t2].join(
                                ' ',
                              )}
                            >
                              shots : {item.shots}
                            </span>
                            <img
                              className={style.user__backgroundS}
                              src="/assets/images/PassportMed.png"
                              width="244"
                              height="346"
                              alt=""
                            />
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className={style.friends__userS}>
                            <img
                              className={style.user__picture}
                              src="/assets/images/lara.jpg"
                              width="160"
                              height="160"
                              alt=""
                            />
                            <span
                              className={[style.user__name, style.t2].join(' ')}
                            >
                              score: {item.score}
                            </span>
                            <span
                              className={[style.user__country, style.t2].join(
                                ' ',
                              )}
                            >
                              shots : {item.shots}
                            </span>
                            <img
                              className={style.user__background}
                              src="/assets/images/PassportMed.png"
                              width="244"
                              height="346"
                              alt=""
                            />
                            {/* {item.online ? 'online' : 'offline'} - score:{' '}
                          {item.score} - shots: {item.shots} */}
                          </div>
                        </>
                      );
                    }
                  })}
                </div>
              </div>
              {/* CONTENT */}
              <div className={style.quiz__content}>
                <div className={style.quiz__contentquiz}>
                  <div className={style.quiz__question}>
                    <span
                      className={[style.question__number, style.t4].join(' ')}
                    >
                      {quiz.current_quiz_step == 0
                        ? '1'
                        : quiz.current_quiz_step / 2 + 1}{' '}
                      / 5
                    </span>
                    <span
                      className={[style.question__title, style.t2].join(' ')}
                    >
                      question{' '}
                      {quiz.current_quiz_step == 0
                        ? '1'
                        : quiz.current_quiz_step / 2}
                    </span>
                    <p
                      className={[style.question__question, style.h2].join(' ')}
                    >
                      {quiz.steps[quiz.current_quiz_step].title}
                    </p>
                    <img
                      className={style.question__card}
                      src="../assets/images/questioncard.png"
                      width="327"
                      height="215"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className={style.quiz__answers}>
                      {quiz?.current_question?.answers?.map((answer, i) => (
                        <>
                          <button
                            className={[
                              style.button,
                              style.quiz__answer,
                              style[`quiz__answer${i + 1}`],
                              style.t1,
                            ].join(' ')}
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
                        </>
                      ))}
                    </div>
                    {/* edit who answered! */}
                    {/* <div className={style.quiz__userfieldpone}>
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>
                    <div className={style.quiz__userfieldptwo}>
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>
                    <div className={style.quiz__userfieldpthree}>
                      <img
                        class={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>
                    <div className={style.quiz__userfieldpfour}>
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>*/}
                  </div>
                  <div className={style.quiz__steps}>
                    {showTakeAShot ? <h5>TAKE A SHOT!!!</h5> : null}
                    {showPlusPoints ? <h5>CORRECT!!! +20 points</h5> : null}

                    <div class={style.steps__feedback}>
                      <img
                        className={style.steps__picture}
                        src={[
                          '../assets/images/progressbar/step',
                          quiz.current_quiz_step,
                          '.png',
                        ].join('')}
                        width="493.5"
                        height="26.25"
                        alt=""
                      />
                    </div>
                    <span className={[style.steps__bottom, style.h3].join(' ')}>
                      you are ready for the next step
                    </span>
                  </div>
                </div>
                <div className={style.quiz__contentrecipe}>
                  <img
                    src="../assets/images/Postit.png"
                    width="300"
                    height="303"
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* BACKGROUND */}
            <img
              src="../assets/images/Card-Back.jpg"
              alt=""
              className={style.background}
            />
          </>
        ) : null}
        {quiz?.current_question?.type === 'recipe' ? (
          <>
            {/* Header */}
            <h1 className={style.hidden}>home</h1>
            <span className={[style.logo, style.h1].join(' ')}>
              Throw A Knife
            </span>

            {/* Quiz Container */}
            <div className={style.quiz__container}>
              <div className={style.quiz__header}>
                <span
                  className={[style.party__participants, style.h2].join(' ')}
                >
                  Participants {players.length}/6
                </span>
                <h1 className={[style.party__title, style.h1].join(' ')}>
                  {quiz.name} - {quiz?.time_to_answer}
                </h1>
              </div>

              {/* FRIENDSLIST */}
              <div className={style.quiz__sidebar}>
                <div className={style.sidebar__friends}>
                  {console.log(players, 'players')}
                  {players.map((item, i) => {
                    if (userStore.user.id == item.user_id) {
                      return (
                        // Show user that is current user
                        <>
                          <div
                            className={[
                              style.friends__userS,
                              style.friends__userself,
                            ].join(' ')}
                          >
                            <img
                              className={style.user__picture}
                              src="../assets/images/lara.jpg"
                              width="160"
                              height="160"
                              alt=""
                            />
                            <span
                              className={[style.user__name, style.t2].join(' ')}
                            >
                              score: {item.score}
                            </span>
                            <span
                              className={[style.user__country, style.t2].join(
                                ' ',
                              )}
                            >
                              shots : {item.shots}
                            </span>
                            <img
                              className={style.user__backgroundS}
                              src="/assets/images/PassportMed.png"
                              width="244"
                              height="346"
                              alt=""
                            />
                          </div>
                        </>
                      );
                    } else {
                      return (
                        // Show users that are not current user
                        <>
                          <div className={style.friends__userS}>
                            <img
                              className={style.user__picture}
                              src="../assets/images/lara.jpg"
                              width="160"
                              height="160"
                              alt=""
                            />
                            <span
                              className={[style.user__name, style.t2].join(' ')}
                            >
                              score: {item.score}
                            </span>
                            <span
                              className={[style.user__country, style.t2].join(
                                ' ',
                              )}
                            >
                              shots : {item.shots}
                            </span>
                            <img
                              className={style.user__background}
                              src="/assets/images/PassportMed.png"
                              width="244"
                              height="346"
                              alt=""
                            />
                            {/* {item.online ? 'online' : 'offline'} - score:{' '}
                          {item.score} - shots: {item.shots} */}
                          </div>
                        </>
                      );
                    }
                  })}
                </div>
              </div>
              {/* CONTENT */}
              <div className={style.quiz__content}>
                <div className={style.quiz__contentquiz}>
                  <div className={style.quiz__question}>
                    <span
                      className={[style.question__number, style.t4].join(' ')}
                    >
                      {quiz.current_quiz_step == 0
                        ? '1'
                        : quiz.current_quiz_step / 2 + 1}{' '}
                      / 5
                    </span>
                    <span
                      className={[style.question__title, style.t2].join(' ')}
                    >
                      cocktail step{' '}
                      {quiz.current_quiz_step == 0
                        ? '1'
                        : quiz.current_quiz_step / 2}
                    </span>
                    <p
                      className={[style.question__question, style.h2].join(' ')}
                    >
                      {quiz.steps[quiz.current_quiz_step].title}
                    </p>
                    <img
                      className={style.question__card}
                      src="../assets/images/questioncard.png"
                      width="327"
                      height="215"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className={style.quiz__answers}>
                      {quiz?.current_question?.answers?.map((answer, i) => (
                        <>
                          <button
                            className={[
                              style.button,
                              style.quiz__answer,
                              style[`quiz__answer${i + 1}`],
                              style.t1,
                            ].join(' ')}
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
                        </>
                      ))}
                    </div>
                    {/* edit who answered! */}
                    {/* <div className={style.quiz__userfieldpone}>
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>
                    <div className={style.quiz__userfieldptwo}>
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>
                    <div className={style.quiz__userfieldpthree}>
                      <img
                        class={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>
                    <div className={style.quiz__userfieldpfour}>
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                      <img
                        className={style.quiz__usericon}
                        src="../assets/images/lara.jpg"
                        width="30"
                        height="30"
                        alt=""
                      />
                    </div>*/}
                  </div>
                  <div className={style.quiz__steps}>
                    {showTakeAShot ? <h5>TAKE A SHOT!!!</h5> : null}
                    {showPlusPoints ? <h5>CORRECT!!! +20 points</h5> : null}

                    <div class={style.steps__feedback}>
                      <img
                        className={style.steps__picture}
                        src={[
                          '../assets/images/progressbar/step',
                          quiz.current_quiz_step,
                          '.png',
                        ].join('')}
                        width="493.5"
                        height="26.25"
                        alt=""
                      />
                    </div>
                    <span className={[style.steps__bottom, style.h3].join(' ')}>
                      you are ready for the next step
                    </span>
                  </div>
                </div>
                <div className={style.quiz__contentrecipe}>
                  <img
                    src="../assets/images/Postit.png"
                    width="300"
                    height="303"
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* BACKGROUND */}
            <img
              src="../assets/images/Card-Back.jpg"
              alt=""
              className={style.background}
            />
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
              {Object.values(pictures)
                .filter((item) => item.src)
                .map((item) => (
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
