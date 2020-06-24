/* eslint-disable react/prop-types */
import React from 'react';
import style from '../SidebarSmall/SidebarSmall.module.css';
import styled from 'styled-components';

const SidebarSmall = ({ userStore, players }) => {
  return (
    <Container className={style.quiz__sidebar}>
      <div className={style.sidebar__friends}>
        {players.map((item, i) => {
          if (userStore.user.id == item.user_id) {
            return (
              // Show user that is current user
              <>
                <FriendElement
                  ready={item.ready}
                  className={[
                    style.friends__user,
                    style.friends__userself,
                  ].join(' ')}
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
                  <span className={[style.user__name, style.t2].join(' ')}>
                    score: {item.score}
                  </span>
                  <span className={[style.user__country, style.t2].join(' ')}>
                    shots : {item.shots}
                  </span>
                  <img
                    className={style.user__background}
                    src="/assets/images/PassportMed.png"
                    width="244"
                    height="346"
                    alt=""
                  />
                </FriendElement>
              </>
            );
          } else {
            return (
              <>
                <FriendElement
                  ready={item.ready}
                  className={style.friends__user}
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
                  <span className={[style.user__name, style.t2].join(' ')}>
                    score: {item.score}
                  </span>
                  <span className={[style.user__country, style.t2].join(' ')}>
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
                </FriendElement>
              </>
            );
          }
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5rem;
`;

const FriendElement = styled.div`
  transition: all 0.2s ease;
  ${({ ready }) => (!ready ? 'filter: grayscale(100%);' : '')};
`;

export default SidebarSmall;
