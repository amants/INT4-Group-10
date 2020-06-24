import { request } from './httpSessionService';

/* * * * * * * * * * * * * * *
 * AUTHENTICATION
 * * * * * * * * * * * * * * */

export async function auth({ username, password }) {
  const path = '/auth';
  const [resp, status] = await request(path, 'POST', {
    identification: username,
    password,
  });
  return [resp, status];
}

export async function getMe() {
  const path = '/me';
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function getCountries() {
  const path = '/countries';
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function getCocktails(orderBy) {
  const path = `/cocktails/${orderBy || 'none'}`;
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function getUsersByQ(q) {
  const path = `/users/${q}`;
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function validateInput(column, q) {
  const path = `/validate/${column}/${q}`;
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function getPartiesFromUser() {
  const path = `/parties`;
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function getCocktailById(cocktailId) {
  const path = `/cocktail/${cocktailId}`;
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}

export async function register({ email, password, country_id, username }) {
  const path = '/register';
  const [resp, status] = await request(path, 'POST', {
    email,
    password,
    country_id,
    username,
  });
  return [resp, status];
}

export async function createParty({ friends, name, startDate }) {
  const path = '/party';
  const [resp, status] = await request(path, 'POST', {
    friends,
    name,
    startDate,
  });
  return [resp, status];
}

export async function logOutUser() {
  const path = '/logout';
  const [resp, status] = await request(path, 'GET');
  return [resp, status];
}
