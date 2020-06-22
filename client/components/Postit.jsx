import React from 'react';
import style from './Postit.module.css';

const Postit = ({ title, quiz }) => {
  return (
    <>
      <div className={style.postit_wrapper} id="recipe">
        <h3 className={style.postit__title}>{title}</h3>
        <div className={style.postit__steps}>
          {quiz.recipe.map((item, i) => {
            return (
              <li key={i} className={style.postit__step}>
                {i}. {item.description}
              </li>
            );
          })}
        </div>
        <img
          className={style.postit__background}
          src="../assets/images/Postit.png"
          width="300"
          height="450"
          alt=""
        />
      </div>
      ;
    </>
  );
};

export default Postit;
