import React from 'react';
import style from './Header.module.css';
const Header = ({page}) => {
  return (
    <>
      <h1 className={style.hidden}>{page}</h1>
      <span className={style.logo}><a className={style.logo} href="/index"> Throw A Knife</a></span>
    </>
  );
};

export default Header;
