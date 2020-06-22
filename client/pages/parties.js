import React from 'react';
import style from './parties.module.css';
import Header from '../components/Header';
import Background from '../components/Background';

const Parties = () => {
  return (
    <>
      <div className={style.container}>
        <Header />
        <div className={style.parties__container}>
          <div className={style.parties__header}>
            <h1 className={style.parties__title}>My parties</h1>
            <button>back</button>
          </div>
          <div className={style.parties__scroll}>
            <a href="" className={style.parties__item}>
              <img
                className={style.parties__background}
                src="../assets/images/parties/Boarding-pass.png"
                width="692"
                height="167"
                alt=""
              />
              <div className={style.parties__wrapper}>
                <span className={[style.item, style.item1].join(' ')}>6 attendees</span>
                <span className={[style.item, style.item2].join(' ')}>
                  Lara maddens party
                </span>
                <div className={[style.item, style.item3].join(' ')}>
                  <span>10/07/2020 - 7:39PM</span>
                  <span>23d 19h 31m 2s</span>
                </div>
              </div>
            </a>
            <a href="" className={style.parties__item}>
              <img
                className={style.parties__background}
                src="../assets/images/parties/Boarding-pass.png"
                width="692"
                height="167"
                alt=""
              />
              <div className={style.parties__wrapper}>
                <span className={[style.item, style.item1].join(' ')}>6 attendees</span>
                <span className={[style.item, style.item2].join(' ')}>
                  Lara maddens party
                </span>
                <div className={[style.item, style.item3].join(' ')}>
                  <span>10/07/2020 - 7:39PM</span>
                  <span>23d 19h 31m 2s</span>
                </div>
              </div>
            </a>
          </div>
          
          <button className={[style.button, style.button__parties].join(' ')}>
            start a party
          </button>
        </div>
      </div>
      <Background />
    </>
  );
};

export default Parties;
