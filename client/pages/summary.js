import React from 'react';
import style from './summary.module.css';
import Header from '../components/Header';
import Background from '../components/Background';

const Summary = () => {
  return (
    <>
      <div className={style.container}>
        <Header />
        <div className={style.summary__wrapper}>
          <span className={style.summary__title}>
            Are you ready for a trip to...?
          </span>
          <div className={style.summary__content}>
            <img
              className={style.summary__image_screen}
              src="../assets/images/summary/screen.png"
              width="117,75"
              alt="78"
            />
            <span>Try to answer correct to five questions.</span>
            <img
              className={style.summary__image_cocktail}
              src="../assets/images/summary/cocktail.png"
              width="39,5"
              height="88,25"
              alt=""
            />
            <span>Come each step closer to your cocktail.</span>
            <img
              className={style.summary__image_shots}
              src="../assets/images/summary/shots.png"
              width="72"
              alt="79,5"
            />
            <span>If you answer wrong, take a shot.</span>
          </div>
          <button  className={(style.button, style.button__summary)}>
            start a party
          </button>
        </div>
      </div>
      <Background />
    </>
  );
};

export default Summary;
