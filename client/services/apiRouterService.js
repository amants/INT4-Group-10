import { request } from "./httpSessionService";

/* * * * * * * * * * * * * * *
 * AUTHENTICATION
 * * * * * * * * * * * * * * */

export async function auth({ username, password }) {
  const path = "/auth";
  const [resp, status] = await request(path, "POST", {
    identification: username,
    password,
  });
  return [resp, status];
}

export async function getMe() {
  const path = "/me";
  const [resp, status] = await request(path, "GET");
  return [resp, status];
}

export async function register({ email, password, nickname, username }) {
  const path = "/register";
  const [resp, status] = await request(path, "POST", {
    email,
    password,
    nickname,
    username,
  });
  return [resp, status];
}

export async function logOutUser() {
  const path = "/logout";
  const [resp, status] = await request(path, "GET");
  return [resp, status];
}
