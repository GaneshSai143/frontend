export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  oauth2: {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      redirectUri: 'http://localhost:4200/oauth2/redirect'
    },
    facebook: {
      clientId: 'YOUR_FACEBOOK_CLIENT_ID',
      redirectUri: 'http://localhost:4200/oauth2/redirect'
    },
    twitter: {
      clientId: 'YOUR_TWITTER_CLIENT_ID',
      redirectUri: 'http://localhost:4200/oauth2/redirect'
    },
    instagram: {
      clientId: 'YOUR_INSTAGRAM_CLIENT_ID',
      redirectUri: 'http://localhost:4200/oauth2/redirect'
    }
  }
}; 