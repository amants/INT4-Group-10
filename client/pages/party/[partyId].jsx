import Head from 'next/head';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';
import getConfig from 'next/config';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import style from './Style.module.css';
import SidebarBig from '../../containers/Sidebar/SidebarBig/SidebarBig';
import SidebarSmall from '../../containers/Sidebar/SidebarSmall/SidebarSmall';
import Header from '../../components/Header';
import Background from '../../components/Background';
import Postit from '../../components/Postit';
import { detect } from 'detect-browser';

const supportedBrowsers = ['chrome', 'firefox'];

const {
  publicRuntimeConfig: { API_URL }, // Available both client and server side
} = getConfig();

let pcList = {};

let localVideo;
let videoRefs = {};

const socket = io(API_URL);

const Home = ({ userStore, partyId }) => {
  const browser = detect();
  const [messages, setMessages] = useState([]);
  const [ready, setReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [picture, setPicture] = useState(null);
  const [chatFormInput, setChatFormInput] = useState('');
  const [pictures, setPictures] = useState({});
  const [endScreenStep, setEndScreenStep] = useState(null);
  const [quiz, setQuiz] = useState({});
  const [stream, setStream] = useState();
  const [showTakeAShot, setShowTakeAShot] = useState(false);
  const [showPlusPoints, setShowPlusPoints] = useState(false);
  const [error, setError] = useState(false);
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [inRoom, setInRoom] = useState(true);

  const videoConstraints = {
    width: 310,
    height: 420,
    facingMode: 'user',
  };

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
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
    if (
      quiz?.current_question?.type === 'recipe' ||
      quiz?.current_question?.type === 'end_screen' ||
      quiz?.current_question?.type === 'lobby'
    ) {
      setReady(false);
    }
    if (quiz?.current_question?.type === 'lobby') {
      setPictures({});
      setCorrectAnswerId(null);
      setAnswerId(null);
    }
  }, [quiz?.current_question?.type]);

  useEffect(() => {
    console.log({ ready });
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

  const startMediaStream = async (userId) => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const tempStream = myStream;

    //displaying local audio stream on the page
    if (localVideo?.srcObject) {
      localVideo.srcObject = tempStream;
    } else {
      localVideo = document.querySelector('#localVideo');
      localVideo.srcObject = tempStream;
    }

    //using Google public stun server
    const configuration = {
      iceServers: [{ url: 'stun:stun2.1.google.com:19302' }],
    };

    pcList[userId] = new RTCPeerConnection(configuration);

    // setup stream listening
    pcList[userId].addStream(tempStream);

    //when a remote user adds stream to the peer connection, we display it
    pcList[userId].onaddstream = function (e) {
      if (videoRefs[userId]) {
        videoRefs[userId].srcObject = e.stream;
      } else {
        videoRefs[userId] = document.querySelector(`#remoteVideo_${userId}`);
        videoRefs[userId].srcObject = e.stream;
      }
    };

    // Setup ice handling
    pcList[userId].onicecandidate = function (event) {
      if (event.candidate) {
        socket.emit('candidate', {
          type: 'candidate',
          candidate: event.candidate,
          target_user_id: userId,
        });
      }
    };
    setStream(tempStream);
  };

  async function handleOffer(offer, userId) {
    console.log(pcList, userId, pcList[userId]);
    await pcList[userId].setRemoteDescription(new RTCSessionDescription(offer));

    //create an answer to an offer
    await pcList[userId].createAnswer(
      async function (answer) {
        await pcList[userId].setLocalDescription(answer);

        console.log('sending answers', answer);
        socket.emit('answerCall', {
          answer: answer,
          target_user_id: userId,
        });
      },
      function (error) {
        alert('Error when creating an answer');
      },
    );
  }

  const StartCall = () => {
    // create an offer
    Object.keys(pcList).forEach((key) => {
      console.log(pcList, key, pcList[key], typeof pcList[key]);
      pcList[key].createOffer(
        function (offer) {
          socket.emit('offer', {
            type: 'offer',
            target_user_id: key,
            offer: offer,
          });

          pcList[key].setLocalDescription(offer);
        },
        function (error) {
          alert('Error when creating an offer');
        },
      );
    });
  };

  console.log(videoRefs);

  useEffect(() => {
    setInRoom(true);
    socket.on('initial messages', (payload) => {
      setMessages(payload.chats.reverse());
      setPlayers(payload.members);
      setQuiz(payload.quiz);
      setPictures(payload.quiz.pictures);
      setEndScreenStep(null);
      if (supportedBrowsers.includes(browser.name)) {
        const filtered = payload.members.filter(
          (item) => item.user_id !== userStore.user.id && item.online,
        );
        if (filtered.length > 0) {
          filtered.forEach((item) => {
            localVideo = document.querySelector(`#localVideo`);
            videoRefs[item.user_id] = document.querySelector(
              `#remoteVideo_${item.user_id}`,
            );
            startMediaStream(item.user_id);
          });
        }
        if (payload.members.length > 1) {
          setTimeout(() => {
            StartCall();
          }, 2000);
        }
      }
      document.title = `new messages have been emitted`;
    });
    socket.on('receive message', (payload) => {
      setMessages((prevValue) => {
        const prevMessage = JSON.parse(JSON.stringify(prevValue));
        prevMessage.reverse();
        prevMessage.push(payload);
        const pushValue = prevMessage.reverse();
        console.log(pushValue);
        return pushValue;
      });
      document.title = `new messages have been emitted`;
    });
    socket.on('errormsg', (payload) => {
      setError(payload.error);
    });

    socket.on('correct answer', (payload) => {
      setCorrectAnswerId(payload.correct_answer);
    });

    socket.on('system message', (payload) => {
      setMessages((prevValue) => {
        const prevMessage = JSON.parse(JSON.stringify(prevValue));
        prevMessage.reverse();
        prevMessage.push(payload);
        const pushValue = prevMessage.reverse();
        return pushValue;
      });
    });

    socket.on('player update', (payload) => {
      setPlayers(payload.members);
      if (supportedBrowsers.includes(browser.name)) {
        const filtered = payload.members.filter(
          (item) => item.user_id !== userStore.user.id && item.online,
        );
        filtered.forEach((item) => {
          videoRefs[item.user_id] = document.querySelector(
            `#remoteVideo_${item.user_id}`,
          );
          startMediaStream(item.user_id);
        });
      }
    });

    if (supportedBrowsers.includes(browser.name)) {
      socket.on('offer', (data) => {
        console.log('offer incoming', data);
        handleOffer(data.offer, data.request_user_id);
      });

      socket.on('answerCall', (data) => {
        console.log('answer incoming', data);
        handleAnswerCall(data.answer, data.request_user_id);
      });

      socket.on('candidate', (data) => {
        console.log('candidate incoming', data);
        handleCandidate(data.candidate, data.request_user_id);
      });
    }

    socket.on('pictures update', (payload) => {
      console.log(payload);
      setPictures(payload.pictures);
    });

    socket.on('ready error', (payload) => {
      console.log('Ready error', payload);
    });

    socket.on('leave', () => {
      handleLeave();
    });

    socket.on('status update', (payload) => {
      setQuiz((prevValue) => ({
        ...prevValue,
        ...payload,
      }));
    });
  }, []);

  function handleLeave() {
    Object.keys(pcList).forEach((key) => {
      videoRefs[key].srcObject = null;
      pcList[key].close();
      pcList[key].onicecandidate = null;
      pcList[key].onaddstream = null;
    });
  }

  function handleCandidate(candidate, userId) {
    pcList[userId].addIceCandidate(new RTCIceCandidate(candidate));
  }

  const handleReady = () => {
    setReady((prevValue) => !prevValue);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    socket.emit('new message', {
      message: chatFormInput,
    });
    setChatFormInput('');
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
    setEndScreenStep('overview');
  };

  function handleAnswerCall(answer, userId) {
    console.log('answering');
    pcList[userId].setRemoteDescription(new RTCSessionDescription(answer));
  }

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
        {players.length > 1 && supportedBrowsers.includes(browser.name) ? (
          <WebcamContainer>
            <RemoteWebCam>
              <video id={`localVideo`} height="100px" autoPlay></video>
            </RemoteWebCam>
            {players
              .filter(
                (item) => item.user_id !== userStore.user.id && item.online,
              )
              ?.map((item) =>
                item.user_id !== userStore.user.id ? (
                  <RemoteWebCam>
                    <p>{item.username}</p>
                    <video
                      height="100px"
                      width="133px"
                      id={`remoteVideo_${item.user_id}`}
                      autoPlay
                    ></video>
                  </RemoteWebCam>
                ) : null,
              )}
          </WebcamContainer>
        ) : null}
        {quiz?.current_question?.type === 'lobby' ? (
          <>
            <div className={style.container}>
              <Header page={'lobby-round'} />
              <div className={style.party__container}>
                <div className={style.party__header}>
                  <span
                    className={[style.party__participants, style.h2].join(' ')}
                  >
                    Participants 5/6
                  </span>
                  <h1 className={[style.party__title, style.h1].join(' ')}>
                    Plan a new party
                  </h1>
                  <span className={[style.uiz__info, style.h2].join(' ')}>
                    This party is complete, <br /> registrations are closed.
                  </span>
                </div>
                <SidebarBig handleReady={handleReady} ready={ready} />
                <div className={style.party__content}>
                  <div className={style.content__needs}>
                    <div className={style.needs__wrapper}>
                      <div className={style.needs__info}>
                        <span
                          className={[style.info__text, style.h2].join(' ')}
                        >
                          This party starts
                        </span>
                        <span
                          className={[style.info__time, style.h2].join(' ')}
                        >
                          now
                        </span>
                        {quiz?.leader?.id === userStore.user.id ? (
                          <>
                            <span
                              className={[style.info__feedback, style.t2].join(
                                ' ',
                              )}
                            >
                              You can only start the game if you are party
                              leader
                            </span>
                            <div className={style.info__start}>
                              <button
                                onClick={handleStart}
                                className={style.button}
                              >
                                start
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                      {players?.length > 1 ? (
                        <>
                          <div className={style.needs__chat}>
                            <span
                              className={[style.chat__title, style.h2].join(
                                ' ',
                              )}
                            >
                              Chat
                            </span>
                            <div className={style.chat__chatbox}>
                              {messages?.map((item, i) => (
                                <div key={i} className={style.chat__row}>
                                  <span
                                    className={
                                      style[
                                        `chat_bubble_${
                                          item.username ===
                                          userStore.user.username
                                            ? 'me'
                                            : 'other'
                                        }`
                                      ]
                                    }
                                  >
                                    {item.username}: {item.message}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className={style.chat__wrapper}>
                              <form onSubmit={handleNewMessage}>
                                <input
                                  className={style.chat__chatinput}
                                  type="text"
                                  value={chatFormInput}
                                  onChange={(e) =>
                                    setChatFormInput(e.target.value)
                                  }
                                  size="35"
                                  name="chatMessage"
                                  placeholder="type your message here"
                                />
                                <input
                                  type="submit"
                                  value="Send"
                                  className={style.chat__chatbutton}
                                />
                              </form>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <img
                      className={style.needs__background}
                      src="../assets/images/clipboard.png"
                      alt=""
                    />
                  </div>
                  <Postit type={'need'} title={'Need to buy'} quiz={quiz} />
                </div>
              </div>
            </div>
            {/* LOGICA HIERONDER */}
            <h1>Players</h1>
            {players.map((item, i) => (
              <p key={i}>
                {item.username} - {item.online ? 'online' : 'offline'} -{' '}
                {item.ready ? 'Ready' : 'waiting ...'}
              </p>
            ))}
            <br />
            {/* BACKGROUND */}
            <Background />
          </>
        ) : null}
        {quiz?.current_question?.type === 'quiz' ? (
          <>
            {/* Header */}
            <Header />

            {/* Quiz Container */}
            <div className={style.quiz__container}>
              <div className={style.quiz__header}>
                <span
                  className={[style.party__participants, style.h2].join(' ')}
                >
                  Participants {players.filter((item) => item.online).length} /{' '}
                  {players.length}
                </span>
                <h1 className={[style.party__title, style.h1].join(' ')}>
                  {quiz.name} - {quiz?.time_to_answer}
                </h1>
              </div>
              {/* FRIENDSLIST */}
              <SidebarSmall userStore={userStore} players={players} />
              {/* CONTENT */}
              <div className={style.quiz__content}>
                <div className={style.quiz__contentquiz}>
                  <div className={style.quiz__question}>
                    <span
                      className={[style.question__number, style.t4].join(' ')}
                    >
                      {quiz?.step == 0 ? '1' : quiz?.step / 2 + 1} / 5
                    </span>
                    <span
                      className={[style.question__title, style.t2].join(' ')}
                    >
                      question {quiz?.step == 0 ? '1' : quiz?.step / 2 + 1} :
                    </span>
                    <p
                      className={[style.question__question, style.h2].join(' ')}
                    >
                      {quiz?.current_question?.title}
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
                        <div
                          className={[]}
                          className={[
                            style.button_container,
                            style[`quiz__answer${i + 1}`],
                          ].join(' ')}
                        >
                          <button
                            className={[
                              style.button,
                              style.quiz__answer,
                              style[
                                `quiz__answer${
                                  correctAnswerId === answer?.answer_id
                                    ? `__correct`
                                    : ''
                                }`
                              ],
                              style.t1,
                            ].join(' ')}
                            key={i}
                            onClick={(e) => handleAnswer(e, answer?.answer_id)}
                          >
                            {answer?.answer}
                          </button>{' '}
                          <div className={[style.answered_by__bullet]}>
                            {quiz?.answered_questions?.[
                              quiz?.current_question?.question_id
                            ]?.[answer?.answer_id]?.map((item, j) => {
                              return (
                                <img
                                  className={style.quiz__usericon}
                                  src="../assets/images/lara.jpg"
                                  width="30"
                                  height="30"
                                  alt=""
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={style.quiz__steps}>
                    {showTakeAShot ? <h5>TAKE A SHOT!!!</h5> : null}
                    {showPlusPoints ? <h5>CORRECT!!! +20 points</h5> : null}

                    <div className={style.steps__feedback}>
                      <img
                        className={style.steps__picture}
                        src={[
                          '../assets/images/progressbar/step',
                          quiz?.step,
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
                <Postit title={'Cocktail recipe'} quiz={quiz} />
              </div>
            </div>
            {/* BACKGROUND */}
            <Background />
          </>
        ) : null}
        {quiz?.current_question?.type === 'recipe' ? (
          <>
            {/* Header */}
            <Header page={'recipe-round'} />

            {/* Quiz Container */}
            <div className={style.quiz__container}>
              <div className={style.quiz__header}>
                <span
                  className={[style.party__participants, style.h2].join(' ')}
                >
                  Participants {players.filter((item) => item.online).length} /{' '}
                  {players.length}
                </span>
                <h1 className={[style.party__title, style.h1].join(' ')}>
                  {quiz.name}
                </h1>
              </div>

              {/* FRIENDSLIST */}
              <SidebarSmall userStore={userStore} players={players} />
              {/* CONTENT */}
              <div className={style.quiz__content}>
                <div className={style.quiz__contentquiz}>
                  <div className={style.quiz__question}>
                    <span
                      className={[style.question__number, style.t4].join(' ')}
                    >
                      {quiz.step == 0 ? '1' : quiz.step / 2 + 1} / 5
                    </span>
                    <span
                      className={[style.question__title, style.t2].join(' ')}
                    >
                      cocktail step{' '}
                      {quiz.step == 0 ? '1' : Math.ceil(quiz.step / 2)} :
                    </span>
                    <p
                      className={[style.question__question, style.h2].join(' ')}
                    >
                      {quiz?.current_question?.description}
                    </p>
                    <img
                      className={style.question__card}
                      src="../assets/images/questioncard.png"
                      width="327"
                      height="215"
                      alt=""
                    />
                  </div>
                  <div className={[style.ready_button__container]}>
                    <button
                      className={[
                        style.ready__button,
                        style.button,
                        style.t1,
                        style[`ready_button${ready ? '__ready' : ''}`],
                      ].join(' ')}
                      onClick={handleReady}
                    >
                      {ready ? "I'm ready!" : 'Ready up'}
                    </button>
                  </div>
                  <div className={style.quiz__steps}>
                    <div className={style.steps__feedback}>
                      <img
                        className={style.steps__picture}
                        src={[
                          '../assets/images/progressbar/step',
                          quiz.step,
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
                <Postit title={'Cocktail recipe'} quiz={quiz} />
              </div>
            </div>
            {/* BACKGROUND */}
            <Background />
          </>
        ) : null}
        {quiz?.current_question?.type === 'end_screen' ? (
          endScreenStep === null ? (
            <>
              {/* Header */}
              <Header page={'endscreen'} />

              {/* Quiz Container */}
              <div className={style.endscreen__container}>
                <div className={style.endscreen__header}>
                  <span
                    className={[style.party__participants, style.h2].join(' ')}
                  >
                    Participants {players.filter((item) => item.online).length}{' '}
                    / {players.length}
                  </span>
                  <h1 className={[style.party__title, style.h1].join(' ')}>
                    {quiz.name}
                  </h1>
                </div>

                {/* FRIENDSLIST */}
                <SidebarSmall userStore={userStore} players={players} />
                {/* CONTENT */}
                <div className={style.endscreen__content}>
                  <span className={style.endscreen__title}>
                    Want to capture this beautiful moment?
                  </span>
                  <img
                    className={style.endscreen__picture}
                    src="../assets/images/endscreen/polaroid.png"
                    width="499"
                    height="541,75"
                    alt=""
                  />
                  <button
                    className={style.button}
                    onClick={() => setEndScreenStep('take_picture')}
                  >
                    let's take a picture
                  </button>
                  <button onClick={() => setEndScreenStep('overview')}>
                    no thanks
                  </button>
                </div>
              </div>
              {/* BACKGROUND */}
              <Background />
            </>
          ) : endScreenStep === 'take_picture' ? (
            <>
              {/* Header */}
              <Header page={'endscreen'} />

              {/* Quiz Container */}
              <div className={style.endscreen__container}>
                <div className={style.endscreen__header}>
                  <span
                    className={[style.party__participants, style.h2].join(' ')}
                  >
                    Participants {players.filter((item) => item.online).length}{' '}
                    / {players.length}
                  </span>
                  <h1 className={[style.party__title, style.h1].join(' ')}>
                    {quiz.name}
                  </h1>
                </div>

                {/* FRIENDSLIST */}
                <SidebarSmall userStore={userStore} players={players} />
                {/* CONTENT */}
                <div className={style.endscreen__content}>
                  {!picture ? (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                      />
                      <button onClick={capture}>Take picture</button>
                    </>
                  ) : (
                    <>
                      <img src={picture} />
                      <button onClick={() => setPicture(null)}>
                        Retake picture
                      </button>
                    </>
                  )}
                  <img
                    className={style.endscreen__cocktail_background}
                    src="../assets/images/endscreen/polaroidTemplate.png"
                    width="644"
                    height="739"
                    alt=""
                  />
                  <button className={style.button} onClick={handlePicture}>Continue</button>
                </div>
              </div>
              {/* BACKGROUND */}
              <Background />
            </>
          ) : endScreenStep === 'overview' ? (
            <>
              <h1>Post game lobby</h1>
              <br />
              <h2>Uploaded pictures:</h2>
              {Object.values(pictures)
                .filter((item) => item.src)
                .map((item) => (
                  <div>
                    <img src={`${API_URL}${item.src}`} />
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
          ) : null
        ) : null}
      </main>
    </div>
  );
};

const RemoteWebCam = styled.div`
  position: relative;
  margin-top: 1rem;
  box-shadow: 0 0 1rem;
  height: 100px;
  width: calc(400px / 3);
  border-radius: 2rem;

  & p {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: white;
    padding: 0.5rem;
    font-size: 1.2rem;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 0 0 2rem 2rem;
  }
`;

const WebcamContainer = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 2rem;

  & video {
    border-radius: 2rem;
    height: 100px;
    width: calc(400px / 3);
  }
`;

export async function getServerSideProps({ params }) {
  return { props: { partyId: params.partyId } };
}

export default inject('userStore')(observer(Home));
