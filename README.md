# Getting Started with Steam API


## SETTING UP LOCAL DEV

FIRST: create a .env file on root with following keys: 
- API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX (get one if need be here https://steamcommunity.com/dev/apikey)
- SECRET=XXXXXXXXXXXX (can be anything
- NAME=XXXXXXXXXXX
- RETURN_URL=http://localhost:8080/auth/steam/return
- REALM=http://localhost:8080/
- HOMEPAGE=http://localhost:3000/

SECOND: In package .JSON remove HOMEPAGE and add 
- "proxy": "http://localhost:8080" 
- AND change start script to 'craco start'

THIRD: 
- In server comment the lines that ask to be commented :) (search for "//comment for local development")
- and change the server.listen port to '8080'

FOURTH:
- In App.js at line 47 CHANGE THE HARDCODED LOGIN URL TO 
- "http://localhost:8080/auth/steam" and "http://localhost:8080/logout"

In the project directory run `npm install`, then you run:

### `npm start` AND `npm run server` IN TWO TERMINALS

Start runs the react app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Run server runs the express server with NODEMON on [http://localhost:8080](http://localhost:8080) 

## TODO
- Add comments
- Error handeling
- MOAR FILTERS


## GOAL

Make an better achievement overview than STEAM GO GO GO
