import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);

    if (localStorage.getItem('accessToken')) {
      this.accessToken = localStorage.getItem('accessToken');
      this.idToken = localStorage.getItem('idToken');
      const expiresIn = Number(localStorage.getItem('expiresIn') || 0);
      this.expiresAt = (expiresIn * 1000) + new Date().getTime();
    }

  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult, true);
      } else if (err) {
        window.location.replace('/login');
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult, redirect) {
    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('expiresAt', authResult.expiresIn);

    if (redirect) {
      window.location.replace('/');
    }
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult, false);
      } else if (err) {
        this.logout();
      }
    });
  }

  checkSession(cb) {
    return this.auth0.checkSession({}, (err, authResult) => {
      if(authResult && authResult.accessToken && authResult.idToken) {
        cb(authResult);
      } else {
        cb(null);
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('key_connection');
    localStorage.removeItem('SerialNumber');

    this.auth0.logout({
      return_to: window.location.origin
    });

    // navigate to the home route
    window.location.replace('/login');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    // let expiresAt = this.expiresAt;
    return this.accessToken && this.idToken; // new Date().getTime() < expiresAt &&
  }
}
