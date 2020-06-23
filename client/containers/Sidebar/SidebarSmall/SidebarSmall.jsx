/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import style from '../SidebarSmall/SidebarSmall.module.css';

const SidebarSmall = ({ userStore, players }) => {
  return (
    <>
      <div className={style.quiz__sidebar}>
        <div className={style.sidebar__friends}>
          {players.map((item, i) => {
            if (userStore.user.id == item.user_id) {
              return (
                // Show user that is current user
                <>
                  <div
                    className={[
                      style.friends__user,
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
                  </div>
                </>
              );
            } else {
              return (
                <>
                  <div className={style.friends__user}>
                    <img
                      className={style.user__picture}
                      src="/assets/images/lara.jpg"
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
                  </div>
                </>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default SidebarSmall;
