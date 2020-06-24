/* eslint-disable react/prop-types */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import style from '../SidebarBig/SidebarBig.module.css';
import AddFriends from '../../../components/AddFriends';

const SidebarBigNewParty = ({
  usersList,
  addedFriends,
  setAddedFriends,
  addFriendInput,
  setAddFriendInput,
  user,
}) => {
  return (
    <div className={style.party__sidebar}>
      <Container>
        <AddFriends
          usersList={usersList}
          addedFriends={addedFriends}
          setAddedFriends={setAddedFriends}
          setAddFriendInput={setAddFriendInput}
          addFriendInput={addFriendInput}
        />
        <div className={style.sidebar__wrapper}>
          <div
            className={[style.sidebar__user, style.sidebar__userself].join(' ')}
          >
            <img
              className={style.user__picture}
              src={user.avatar || '../assets/images/lara.jpg'}
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
          {addedFriends.map((item) => (
            <FriendElement className={[style.sidebar__user].join(' ')}>
              <img
                className={style.user__picture}
                src={item.avatar || '../assets/images/lara.jpg'}
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
              <Button
                className={style.button}
                onClick={() => {
                  setAddedFriends((prevValue) => {
                    const temp = prevValue.filter(
                      (e) => e.user_id !== item.user_id,
                    );
                    return temp;
                  });
                }}
              >
                Remove
              </Button>
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
      </Container>
    </div>
  );
};

const Button = styled.button`
  background: white !important;
  color: #102146;
  padding: 0.5rem 1rem !important;
  text-align: center;
  display: block;
  position: relative;
  left: 10rem;
  top: -1rem;
`;

const fadeIn = keyframes`
 0% { opacity: 0;  }
 100% { opacity: 1; }`;

const FriendElement = styled.div`
  animation-name: ${fadeIn};
  animation-duration: 0.4s;
  animation-iteration-count: 1;
`;

const Container = styled.div`
  max-width: 240px;
`;

const FlagImg = styled.img`
  height: 15px;
  margin-top: 5px;
`;

export default SidebarBigNewParty;
