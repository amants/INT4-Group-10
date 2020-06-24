import React from 'react';
import style from './PolaroidHome.module.css';

const PolaroidHome = ({ country }) => {

    return (
        <a className={style[`polaroid_wrapper__${country}`]}>
        <img
          className={style.polaroid__stamp}
          src={['./assets/images/Stamps/', country, '.png'].join('')}
          width="20"
          alt=""
        />
        <img
          className={style.polaroid__image}
          src="./assets/images/lara.jpg"
          width="38.5"
          height="52.5"
        />
        <img
          className={style.polaroid__background}
          src="./assets/images/home/polaroid.png"
          width="80"
          height="92"
          alt=""
        />
      </a>
    )
};

export default PolaroidHome;
