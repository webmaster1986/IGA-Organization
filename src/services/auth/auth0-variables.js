export const AUTH_CONFIG = {
  domain: 'dietechsoftware.auth0.com',
  clientId: 'wrzuOWoAFDOjgdGCprS8GCwqaoRB72Yw',
  callbackUrl: process.env.NODE_ENV === 'production' ? 'https://console.psisupport.com/callback' : 'http://localhost:3000/callback'
}
