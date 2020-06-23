import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import style from './Style.module.css';
import SidebarBig from '../../containers/Sidebar/SidebarBig/SidebarBig';
import SidebarSmall from '../../containers/Sidebar/SidebarSmall/SidebarSmall';
import Header from '../../components/Header';
import Background from '../../components/Background';

const Home = ({ userStore }) => {
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
        <div className={style.container}>
          <Header page={'lobby-round'} />
          <div className={style.party__container}>
            <div className={style.party__header}>
              <span className={[style.party__participants, style.h2].join(' ')}>
                Participants 5/6
              </span>
              <h1 className={[style.party__title, style.h1].join(' ')}>
                Plan a new party
              </h1>
              {/* <span className={[style.uiz__info, style.h2].join(' ')}>
                This party is complete, <br /> registrations are closed.
              </span> */}
            </div>
            <SidebarBig
              addFriends={true}
              // handleChange
            />
            <div className={style.party__content}>
              <div className={style.content__needs}>
                <div className={style.needs__wrapper}></div>
                <img
                  className={style.needs__background}
                  src="../assets/images/clipboard.png"
                  alt=""
                />
              </div>
              {/* <Postit type={'need'} title={'Need to buy'} quiz={quiz} /> */}
            </div>
          </div>
        </div>
        <br />
        {/* BACKGROUND */}
        <Background />
      </main>
    </div>
  );
};

export default inject('userStore')(observer(Home));
