/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import fetch from "isomorphic-fetch";
import getConfig from "next/config";
import { setLoggedIn } from "./authService";

const {
  publicRuntimeConfig: { API_URL }, // Available both client and server side
} = getConfig();

const baseAPI = API_URL;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function fetchBaseAPi() {
  return baseAPI;
}

async function _request(path, method, payload) {
  const API = baseAPI || (await fetchBaseAPi());
  const url = API + path;
  let req;
  console.log(`[API REQUEST] ${method} ${path}`);
  if (payload === null) {
    req = await fetch(`${url}`, {
      method,
      headers,
      credentials: "include",
    });
  } else {
    req = await fetch(`${url}`, {
      method,
      headers,
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      credentials: "include",
    });
  }

  console.log(`[API RESPONSE] ${method} ${path} status: ${req.status}`);
  let resp;
  console.log(req);
  if (req.status !== 204) {
    resp = await req.json();
  } else {
    resp = null;
  }
  return [resp, req.status];
}

export async function logout() {
  const path = "logout";
  const [resp, status] = await request(path, "GET");
  if (status === 200) {
    setLoggedIn(false);
  } else {
    console.error(resp, status);
  }
}

export async function request(path, method, payload = null) {
  let [resp, status] = await _request(path, method, payload);
  if (status === 401) {
    if (resp.message === "INVALID_TOKEN") {
      await logout();
    }
  }
  return [resp, status];
}
