/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useRef, cloneElement } from 'react';
import styled, { keyframes } from 'styled-components';
import { inject, observer } from 'mobx-react';

const PopUp = ({ name, children, interfaceStore, ...props }) => {
  const { togglePopUp } = interfaceStore;
  const popupRef = useRef();
  const closeHandler = (e) => {
    if (e?.stopPropagation) e?.stopPropagation();
    popupRef.current.style.opacity = 0;
    setTimeout(() => {
      togglePopUp(name, false);
    }, 200);
  };

  const PopUpChildren = cloneElement(children, { closePopUp: closeHandler });

  return (
    <Container ref={popupRef} onClick={closeHandler} {...props}>
      <LoginContainer onClick={(e) => e.stopPropagation()}>
        {PopUpChildren}
      </LoginContainer>
    </Container>
  );
};

PopUp.getInitialProps = async ({ store: { interfaceStore } }) => {
  return {
    interfaceStore,
  };
};

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
  border-radius: 0.5rem;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: space-around;
  transition: opacity 0.2s ease;
  align-items: center;
  animation-name: ${fadeIn};
  animation-duration: 0.2s;
  animation-iteration-count: 1;
`;

export default inject('interfaceStore', 'userStore')(observer(PopUp));
