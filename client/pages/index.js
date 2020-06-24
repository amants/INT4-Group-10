import Head from 'next/head';
import React /*, { useEffect, useState } */ from 'react';
import { inject, observer } from 'mobx-react';
import style from './index.module.css';
import Header from '../components/Header';
import PolaroidHome from '../components/PolaroidHome';

const Home = ({ userStore, interfaceStore }) => {
  const { togglePopUp } = interfaceStore;
  if (!userStore.auth) {
    return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main></main>
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
        <div className={style.container}>
          <Header />
          <div className={style.home__top}>
            <a
              href="/party/new"
              className={[style.button, style.button__top_throw].join(' ')}
            >
              Throw a new knife
            </a>
            <span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  togglePopUp('parties', true);
                }}
                className={style.topparty}
              >
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
                You have already visited{' '}
                {userStore.user.unlocked_cocktails.length} countries
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
                    <a
                      className={style.stats__detaillink}
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        togglePopUp('cocktails', true);
                      }}
                    >
                      Cocktails
                    </a>
                  </span>
                  <span
                    className={[style.stats__detailbold, style.button].join(
                      ' ',
                    )}
                  >
                    {userStore.user.unlocked_cocktails.length}
                  </span>
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
                {userStore.user.username}
              </span>
              <button
                className={[style.button, style.button_account].join(' ')}
                onClick={(e) => {
                  e.preventDefault();
                  togglePopUp('profile', true);
                }}
              >
                Account
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

export default inject('userStore', 'interfaceStore')(observer(Home));
