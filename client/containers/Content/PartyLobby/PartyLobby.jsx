import React from "react";

import { useState } from "react";

import style from "./AddGroup.module.css";
import ContentHeader from "../../../components/ContentHeader/ContentHeader.js";
import Group from "../../../models/Group";
import { useStores } from "../../../hooks/useStores";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../../consts";

const PartyLobby = () => {
  const [name, setName] = useState("");
  const { dataStore } = useStores();
  const history = useHistory();

  const handleSubmit = e => {
    e.preventDefault();
    const g = new Group({ name, store: dataStore });
    history.push(ROUTES.groupDetail.to + g.id);
  };

  return (
    <>
      <ContentHeader title={"Add group"} />
      <div className={style.container}>
        <form onSubmit={handleSubmit} className={style.form}>
          <label className={style.label}>
            <span>Groupname</span>
            <input
              className={style.input}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <input type="submit" value="Add group" className={style.button} />
        </form>
      </div>
    </>
  );
};

export default PartyLobby;
