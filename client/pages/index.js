import Head from 'next/head';
import React /*, { useEffect, useState } */ from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';
import style from './index.module.css';
import Header from '../components/Header';
import PolaroidHome from '../components/PolaroidHome';

// const socket = io('http://localhost:5000');

const Home = ({ userStore }) => {
  console.log(userStore);
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
        <div className={style.container}>
          <Header />
          <div className={style.home__top}>
            <button
              className={[style.button, style.button__top_throw].join(' ')}
            >
              <a href="/pages/index-party.html">throw a new knife</a>
            </button>
            <span>
              <a href="/parties" className={style.topparty}>
                all parties
              </a>
            </span>
          </div>
          <div className={style.home__stats} id="stats">
            <div className={style.stats__content}>
              <h2 className={style.hidden}>stats</h2>
              <p className={style.stats__title}>
                <span className={style.stats__title_name}>
                  {userStore.user.username}
                </span>
                ,
                <br />
                you have already visited 3 countries
              </p>
              <ul className={style.stats__details}>
                <li className={style.stats__detail}>
                  <span>km's</span>
                  <span className={style.stats__detailbold}>2405km</span>
                </li>
                <li className={style.stats__detail}>
                  <span>score</span>
                  <span className={style.stats__detailbold}>50pts</span>
                </li>
                <li className={style.stats__detail}>
                  <span>
                    <a className={style.stats__detaillink} href="">
                      Cocktails
                    </a>
                  </span>
                  <span className={style.stats__detailbold}>6</span>
                </li>
              </ul>
            </div>
            <img
              className={style.stats__background}
              src="./assets/images/PaperClip.jpg"
              alt="image of paper with paperclip"
            />
          </div>
          <div className={style.home__account} id="account">
            <h2 className={style.hidden}>account</h2>
            <div className={style.account__content}>
              <img
                className={style.account__tape}
                src="./assets/images/Plakband4.png"
                alt="blue tape to hold picture"
              />
              <img
                className={style.account__profilepicture}
                src="./assets/images/lara.jpg"
                alt="profilepicture"
              />
              <span className={style.account__name}>
                Lara <br />
                Maddens
              </span>
              <button
                className={[style.button, style.button_account].join(' ')}
              >
                account
              </button>
            </div>
            <img
              className={style.account__background}
              src="./assets/images/Passport.png"
              alt="background"
            />
          </div>
        </div>
        <div className={style.background__wrapper}>
          <div className={style.background__grid}>
            <PolaroidHome country={'cuba'} />
          </div>
          <img
            className={style.background}
            src="./assets/images/backgrounds/Card.jpg"
            width="1440"
            height="900"
            alt="image of a map"
          />
        </div>
      </main>
    </div>
  );
};

export default inject('userStore')(observer(Home));
