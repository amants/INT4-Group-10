/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useRef, cloneElement, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { inject, observer } from 'mobx-react';

const PopUp = ({ name, children, interfaceStore, allowClose, ...props }) => {
  const { togglePopUp } = interfaceStore;
  const popupRef = useRef();

  useEffect(() => {
    popupRef.current.style.opacity = 1;
  }, []);

  const closeHandler = (e) => {
    if (e?.stopPropagation) e?.stopPropagation();
    if (!allowClose) return;
    popupRef.current.style.opacity = 0;
    setTimeout(() => {
      togglePopUp(name, false);
    }, 200);
  };

  const PopUpChildren = cloneElement(children, { closePopUp: closeHandler });

  return (
    <Container ref={popupRef} onClick={closeHandler} {...props}>
      <BookContainer onClick={(e) => e.stopPropagation()}>
        <ContentContainer>{PopUpChildren}</ContentContainer>
      </BookContainer>
    </Container>
  );
};

PopUp.getInitialProps = async ({ store: { interfaceStore } }) => {
  return {
    interfaceStore,
  };
};

const fadeIn = keyframes`
 0% { opacity: 0;  }
 100% { opacity: 1; }`;

const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 2rem;
`;

const BookContainer = styled.div`
  max-width: 76rem;
  width: 80vw;
  background-size: 100% 100%;
  position: relative;
  height: 58vw;
  max-height: 54.9rem;
  min-height: 45rem;
  ${'' /* background-size: 100%; */}
  background-repeat: no-repeat;
  background-position: center center;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 80%;
  background-image: url('/assets/images/PassPortOpenBlue.png');
  border-radius: 0.5rem;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  background-image: url('/assets/images/Card/Card-Blurred.jpg');
  background-size: cover;
  justify-content: space-around;
  transition: opacity 0.2s ease;
  align-items: center;
  animation-name: ${fadeIn};
  animation-duration: 0.2s;
  animation-iteration-count: 1;
`;

export default inject('interfaceStore', 'userStore')(observer(PopUp));
