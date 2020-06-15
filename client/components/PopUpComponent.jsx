/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { inject, observer } from 'mobx-react';

const PopUp = ({ name, children, interfaceStore }) => {
  const { togglePopUp } = interfaceStore;
  const closeHandler = e => {
    if (!e) e = '';
    e.stopPropagation();
    togglePopUp(name, false);
  }

  return (
    <Container onClick={closeHandler}>
      <LoginContainer onClick={e => e.stopPropagation()}>
        {children}
      </LoginContainer>
    </Container>
  );
};

PopUp.getInitialProps = async ({store: { interfaceStore }}) => {
  return {
    interfaceStore,
  };
}

const fadeIn = keyframes`
 0% { opacity: 0; }
 100% { opacity: 1 }`;

const LoginContainer = styled.div`
  padding: 4rem;
  max-width: 40rem;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
  background-color: white;
  border-radius: .5rem;

`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0,0,0,0.65);
  display: flex;
  justify-content: space-around;
  align-items: center;
  animation-name: ${fadeIn};
   animation-duration: .2s;
   animation-iteration-count: 1;
`;

export default inject('interfaceStore', 'userStore')(observer(PopUp));