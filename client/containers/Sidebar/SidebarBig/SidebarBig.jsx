/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import style from '../SidebarBig/SidebarBig.module.css';
import AddFriends from '../../../components/AddFriends';

const SidebarBig = ({ handleReady, ready }) => {
  return (
    <>
      <div className={style.party__sidebar}>
        <AddFriends />
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
              src="../assets/images/lara.jpg"
              width="160"
              height="160"
              alt=""
            />
            <span className={[style.user__name, style.h2].join(' ')}>
              Lara Maddens
            </span>
            <span className={[style.user__country, style.t2].join(' ')}>
              🇧🇪 Belgium
            </span>
            <img
              className={style.user__background}
              src="/assets/images/PassportMed.png"
              width="244"
              height="346"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarBig;
