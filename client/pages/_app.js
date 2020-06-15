/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import App from "next/app";
import getConfig from "next/config";
import { withRouter } from "next/router";
import fetch from "isomorphic-fetch";
import { withMobx } from "next-mobx-wrapper";
import { configure } from "mobx";
import { Provider, useStaticRendering } from "mobx-react";
import { Reset } from "../components/Reset";
import Layout from "../components/Layout";
import * as getStores from "../stores";

const {
  publicRuntimeConfig: { API_URL }, // Available both client and server side
} = getConfig();

const isServer = !process.browser;

configure({ enforceActions: "observed" });
useStaticRendering(isServer); // NOT `true` value

async function getUserData(cookie) {
  const req = await fetch(`${API_URL}/me`, {
    method: "get",
    credentials: "include",
    headers: { cookie },
  });
  const resp = await req.json();
  return [resp, req.status, req];
}

const getCookie = (cookie, name) => {
  const match = cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (match) return match[2];
  return false;
};

class MyApp extends App {
  constructor(props) {
    super();
    this.pathname = props.router.pathname;
  }

  static async getInitialProps({ Component, ctx }) {
    const cookie = ctx.req ? ctx.req.headers.cookie : null;
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const [resp, status, req] = await getUserData(cookie);
    if (status === 200) {
      ctx.store.userStore.setUser(resp);
      ctx.store.userStore.setAuth(true);
      pageProps = { ...pageProps, user: resp };
    }

    pageProps = { ...pageProps };
    // Pass cookies from the getuserdata call to the client
    if (req.headers._headers["set-cookie"])
      ctx.res.setHeader("Set-Cookie", req.headers._headers["set-cookie"]);
    return {
      pageProps,
    };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const { user } = pageProps;

    return (
      <>
        <Reset />
        <Provider {...store}>
          <Layout currentPage={this.pathname} user={user}>
            <Component {...pageProps} user={user} />
          </Layout>
        </Provider>
      </>
    );
  }
}
export default withMobx(getStores)(withRouter(MyApp));
