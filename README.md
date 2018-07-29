Simple authenticator which uses Google oauth2 and API endpoint which returns whitelish hashmap

## Prerequisites

You need to have docker and docker-compose installed in your system

## Environmental variables

All the environmental variables can be placed in `/etc/environment` file.
Environment file can be overriden in docker-compose.yaml

Example of environment file:

```
GOOGLE_OAUTH_CLIENT_ID=<CLIENT_ID>
GOOGLE_OAUTH_CLIENT_SECRET=<CLIENT_SECRET>
GOOGLE_OAUTH_REDIRECT_URI=http://localhost/api/oauth/callback
OAUTH_WHITELIST=https://example.com/whitelist.json
OAUTH_REFERER=http://localhost:3000
```

### Format of whitelist.json

```
{
	"<GOOGLE_USER_ID>":<ANY_OBJECT>,
	"<GOOGLE_USER_ID>":<ANY_OBJECT>
}
```

## Build

```
docker-compose build
```

## Run

```
docker-compose up
```
