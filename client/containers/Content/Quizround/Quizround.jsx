import React from "react";

import { useState } from "react";

import style from "./Quizround.module.css";


const Quizround = () => {
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
      
    </>
  );
};

export default Quizround;
