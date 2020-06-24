/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { string, node } from 'prop-types';
import { inject, observer } from 'mobx-react';
import PopUpComponent from './PopUpComponent';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CocktailsContainer from './CocktailsContainer';
import PopUpPageComponent from './PopUpPageComponent';
import PartiesComponent from './PartiesComponent';
import ProfileComponent from './ProfileComponent';

const Layout = ({ children, interfaceStore, userStore }) => {
  const { showPopup, togglePopUp } = interfaceStore;
  const { login, cocktails, parties, register, profile } = showPopup;

  useEffect(() => {
    if (!userStore.user) togglePopUp('login', true);
  }, []);

  return (
    <Container>
      {register ? (
        <PopUpComponent name="register" allowClose={false}>
          <RegisterForm />
        </PopUpComponent>
      ) : null}
      {login ? (
        <PopUpComponent name="login" allowClose={false}>
          <LoginForm />
        </PopUpComponent>
      ) : null}
      {cocktails ? (
        <PopUpComponent name="cocktails" allowClose={true}>
          <CocktailsContainer />
        </PopUpComponent>
      ) : null}
      {parties ? (
        <PopUpPageComponent name="parties">
          <PartiesComponent />
        </PopUpPageComponent>
      ) : null}
      {profile ? (
        <PopUpComponent name="profile" allowClose={true}>
          <ProfileComponent />
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

export default inject('interfaceStore', 'userStore')(observer(Layout));
