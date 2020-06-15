/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { string, node } from "prop-types";
import { inject, observer } from "mobx-react";
import PopUpComponent from "./PopUpComponent";

const Layout = ({ currentPage, children, interfaceStore }) => {
  const { showPopup } = interfaceStore;
  const { login } = showPopup;

  return (
    <Container>
      {login ? (
        <PopUpComponent name="login">
          <h1>Login</h1>
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
  currentPage: "",
  isDesktopNav: "false",
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
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  min-height: calc(100vh - 15rem);
`;

export default inject("interfaceStore")(observer(Layout));
