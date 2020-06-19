/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { string, node } from 'prop-types';
import { inject, observer } from 'mobx-react';
import PopUpComponent from './PopUpComponent';
import LoginForm from './LoginForm';

const Layout = ({ currentPage, children, interfaceStore }) => {
  const { showPopup } = interfaceStore;
  const { login } = showPopup;

  return (
    <Container>
      {login ? (
        <PopUpComponent name="login">
          <LoginForm />
        </PopUpComponent>
      ) : null}
      <Main>{children}</Main>
    </Container>
  );
};

Layout.getInitialProps = async ({ store: { userStore, interfaceStore } }) => {
  return {
    interfaceStore,
    userStore,
  };
};

Layout.defaultProps = {
  currentPage: '',
  isDesktopNav: 'false',
};

Layout.propTypes = {
  currentPage: string,
  children: node.isRequired,
  isDesktopNav: string,
};

const Container = styled.div`
  font-family: arial, helvetica, sans-serif;
  padding: 0;
  padding-top: 5rem;
  width: 100%;
  @media only screen and (max-width: 700px) {
    padding-top: 10rem;
  }
`;

const Main = styled.div`
  width: 100%;

`;

export default inject('interfaceStore')(observer(Layout));
