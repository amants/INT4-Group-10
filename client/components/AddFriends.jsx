import React from 'react';
import style from './AddFriends.module.css';

const AddFriends = ({}) => {
  return (
    <>
      <h2 className={(style.sidebar__title, style.h2)}>Add friends</h2>
      <form className={style.sidebar__input}>
        <input
          className={[style.input, style.inputsidebar, style.h2].join(' ')}
          type="text"
          size="20"
          placeholder="search for friends"
        />
        <img src="/assets/images/search-icon.png" alt="search icon" />
      </form>
    </>
  );
};

export default AddFriends;