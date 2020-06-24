/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
// import ActionButton from './ActionButton';
import CurrentRegisterStep from './CurrentRegisterStep';
import { register } from '../services/apiRouterService';

const RegisterForm = ({ userStore, interfaceStore }) => {
  const [registerStep, setRegisterStep] = useState(0);
  const [registerValues, setRegisterValues] = useState({});

  const addUser = async (username, password, country_id, email) => {
    const [, status] = await register({
      username,
      password,
      country_id,
      email,
    });
    if (status === 200) {
      location.reload();
    }
  };

  return (
    <Container>
      <CurrentRegisterStep
        registerStep={registerStep}
        setRegisterStep={setRegisterStep}
        registerValues={registerValues}
        setRegisterValues={setRegisterValues}
        userStore={userStore}
        addUser={addUser}
        interfaceStore={interfaceStore}
      />
    </Container>
  );
};

RegisterForm.getInitialProps = async ({
  store: { userStore, interfaceStore },
}) => {
  return {
    interfaceStore,
    userStore,
  };
};

const Container = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  height: 100%;
`;

export default inject('interfaceStore', 'userStore')(observer(RegisterForm));
