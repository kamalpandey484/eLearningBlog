import axios from 'axios';
import { API } from '../config';
import cookie from 'js-cookie';

export const signup = user => {
  return (
    axios.post(`${API}/signup`, user)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const signin = user => {
  return (
    axios.post(`${API}/signin`, user)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

export const signout = next => {
  removeCookie('token');
  removeLocalStorage('user');
  next();

  return (
    axios.get(`${API}/signout`)
      .then(res => res.data)
      .catch(err => err.response.data)
  )
}

// set cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1
    })
  }
}

// remove cookie
export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    })
  }
}

// get cookie
export const getCookie = key => {
  if (process.browser) {
    return cookie.get(key)
  }
}

// local storage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// remove local storage
export const removeLocalStorage = key => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
}

// authenticate user by passing data to cookie and local storage
export const authenticate = (data, next) => {
  setCookie('token', data.token);
  setLocalStorage('user', data.user);
  next()
}

// check authentication
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie('token');
    const userChecked = localStorage.getItem('user');
    if (cookieChecked) {
      if (userChecked) {
        return JSON.parse(userChecked);
      } else {
        return false;
      }
    }
  }
}
