/* eslint-disable react/prop-types */
import React from 'react';
import getConfig from 'next/config';
import styled from 'styled-components';
import style from '../SidebarBig/SidebarBig.module.css';

const {
  publicRuntimeConfig: { API_URL }, // Available both client and server side
} = getConfig();

const SidebarBig = ({ handleReady, ready, user, players }) => {
  return (
    <>
      <FriendElement ready={ready} className={style.party__sidebar}>
        <br />
        {handleReady ? (
          <button className={style.button} onClick={handleReady}>
            {ready && `Unready`}
            {!ready && `Ready`}
          </button>
        ) : null}
        <div className={style.sidebar__wrapper}>
          <div
            className={[style.sidebar__user, style.sidebar__userself].join(' ')}
          >
            <img
              className={style.user__picture}
              src={
                user.avatar
                  ? `${API_URL}${user.avatar}`
                  : '../assets/images/lara.jpg'
              }
              width="160"
              height="160"
              alt=""
            />
            <span className={[style.user__name, style.h2].join(' ')}>
              {user.username}
            </span>
            <span className={[style.user__country, style.t2].join(' ')}>
              <FlagImg src={`/assets/images/flags/${user.flag_url}`} />{' '}
              {user.country_name}
            </span>
            <img
              className={style.user__background}
              src="/assets/images/PassportMed.png"
              width="244"
              height="346"
              alt=""
            />
          </div>
          {players.map((item) => (
            <FriendElement
              key={item.user_id}
              ready={item.ready}
              className={[style.sidebar__user].join(' ')}
            >
              <img
                className={style.user__picture}
                src={
                  item.avatar
                    ? `${API_URL}${item.avatar}`
                    : '../assets/images/lara.jpg'
                }
                width="160"
                height="160"
                alt=""
              />
              <span className={[style.user__name, style.h2].join(' ')}>
                {item.username}
              </span>
              <span className={[style.user__country, style.t2].join(' ')}>
                <FlagImg src={`/assets/images/flags/${item.flag_url}`} />{' '}
                {item.name}
              </span>
              <img
                className={style.user__background}
                src="/assets/images/PassportMed.png"
                width="244"
                height="346"
                alt=""
              />
            </FriendElement>
          ))}
        </div>
      </FriendElement>
    </>
  );
};

const FriendElement = styled.div`
  transition: all 0.2s ease;
  ${({ ready }) => (!ready ? 'filter: grayscale(100%);' : '')};
`;

const FlagImg = styled.img`
  height: 15px;
  margin-top: 5px;
`;

export default SidebarBig;
