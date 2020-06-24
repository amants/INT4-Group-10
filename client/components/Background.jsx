import React from 'react';
import style from './Background.module.css';

const Background = ({ page }) => {
  if (page === 'home') {
    return (
      <img
        src="../assets/images/Card.jpg"
        alt=""
        className={style.background}
      />
    );
  } else {
    return (
      <>
        <img
          src="../assets/images/Backgrounds/Card-Back.jpg"
          alt=""
          className={style.background}
        />
      </>
    );
  }
};

export default Background;
