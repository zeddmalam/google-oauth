import url from 'url';
import querystring from 'querystring';
import express from 'express';
import * as googleapis from 'googleapis';
import request from 'superagent';

const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI, OAUTH_WHITELIST, OAUTH_REFERER } = process.env;
const app = express();
const { google } = googleapis.default;
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI
);

google.options({ auth: oauth2Client });
const plus = google.plus('v1');

app.get('/api/oauth', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.readonly'
  ];
    const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' ')
  });
  res.redirect(authorizeUrl);
});

app.get('/api/oauth/callback', async (req, res) => {
  console.log('/api/oauth/callback');
  try {
    const qs = querystring.parse(url.parse(req.url).query);
    const whitelist = await request.get(OAUTH_WHITELIST);
    const { tokens } = await oauth2Client.getToken(qs.code);
    oauth2Client.credentials = tokens;
    const me = await plus.people.get({ userId: 'me' });
    console.log('/oauth/redirect:', tokens, me.data, whitelist.body);
    if (!whitelist.body[me.data.id]) {
      res.status(401).send(`Unauthorized:!`);
      console.log('Unauthorized', me.data.id, whitelist.body);
      return;
    }
    res.redirect(`${OAUTH_REFERER}?tokens=${JSON.stringify(tokens)}`);
  } catch (error) {
    res.status(401).send('Unauthorized!');
    console.log('error', error);
  }
});

app.get('/api/oauth/authorized', async (req, res) => {
  console.log('/api/oauth/authorized');
  try {
    const tokenInfo = await request.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${req.get('Authorization').replace('Bearer ', '')}`);
    const whitelist = await request.get(OAUTH_WHITELIST);
    if (!whitelist.body[tokenInfo.body.sub]) {
      res.status(401).send(`Unauthorized:!`);
      console.log('Unauthorized', me.data.id, whitelist.body);
      return;
    }
    res.send(JSON.stringify(tokenInfo.body));
    console.log('tokenInfo', tokenInfo.body);
    return;
  } catch (error) {
    res.status(401).send('Unauthorized!');
    console.log('error', error);
  }
});

app.listen(3000);


