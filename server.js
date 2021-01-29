var express = require('express')
    , passport = require('passport')
    , util = require('util')
    , session = require('express-session')
    , SteamStrategy = require('passport-steam').Strategy;

var cors = require('cors')
var axios = require('axios');
require('dotenv').config()

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
        returnURL: 'http://localhost:8080/auth/steam/return',
        realm: 'http://localhost:8080/',
        apiKey: process.env.API_KEY
    },
    function(identifier, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Steam profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Steam account with a user record in your database,
            // and return that user instead.
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

var server = express();

server.use(cors())
server.use(session({
    secret: 'terces-sirohcco',
    name: 'sirohcco-session',
    resave: true,
    saveUninitialized: true}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize());
server.use(passport.session());

//home route
server.get('/', function(req, res){
    console.log("index ROUTE HIT");
    console.log("user is ");
    console.log(req.user);
    res.redirect("http://localhost:3000/");
});

//api home test
server.get('/api/home', function(req, res){
    console.log("HOME ROUTE HIT");
    console.log("user is ");
    if (req.user)
    {
        res.send('Hallo ' + req.user.displayName);
    }
    else{
        res.send(' hello plz login :(' );
    }
});

//get account details
server.get('/api/account', ensureAuthenticated,  function(req, res){
    console.log("account route hit");
    console.log("user is ");
    console.log(req.user);
    res.send({user: req.user});
});

//check if allowed
server.get('/api/check', function(req, res){
    console.log("CHECK route hit");
    console.log("user is ");
    console.log(req.user);
    if (req.user) {
        res.send({user: req.user});
    }
    else {
        res.status(400).send({
            message: 'NOT ALLOWED YA FUDGER'
        });
    }

});

//get all games
server.get('/api/allgames', ensureAuthenticated, async function (req, res){
    console.log('allgames ROUTE hit');
    let allG = await allGames(req.user.id);
    console.log(allG.data.response.games);
    res.send(allG.data.response.games);
})

//get game detail
server.get('/api/game/', ensureAuthenticated, async function (req, res){

    console.log('DETAILLLL HIT');
    console.log(req.query.appid);
    let detailG = await  gameDetail(req.query.appid)
    console.log(detailG.data);
    res.send(detailG.data);
})

//get achievement detail
server.get('/api/achievement/', ensureAuthenticated, async function (req, res){

    console.log('achievement HIT');
    console.log(req.query.appid);
    let achievementG = await  getAchievements(req.user.id, req.query.appid)
    console.log(achievementG.data);
    res.send(achievementG.data);
})

//get percentage detail
server.get('/api/percentage/', ensureAuthenticated, async function (req, res){

    console.log('percentage HIT');
    console.log(req.query.appid);
    let percentageG = await  getGlobalStats(req.query.appid)
    console.log(percentageG.data);
    res.send(percentageG.data);
})

//logout route
server.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://localhost:3000/');
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
server.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        console.log("user is pre steam");
        console.log(req.user);
        res.redirect('/account');
    });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
server.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        console.log("user is after steam");
        console.log(req.user);
        res.redirect("http://localhost:3000/account");
    });

server.listen(8080);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    console.log("user is ");
    console.log(req.user);
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

async function allGames(id) {
    try {
        return await axios.get(
            'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/',
            {
                params: {
                    key: process.env.API_KEY,
                    steamid: id,
                    include_appinfo: 'true',
                    include_played_free_games: 'true',
                }
            }
        );
    } catch (error) {
        console.error(error)
    }
}

async function gameDetail(appid) {
    try {
        return await axios.get(
            'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2',
            {
                params: {
                    key: process.env.API_KEY,
                    appid: appid,
                }
            }
        );
    } catch (error) {
        console.log("DETAIL FAIL");
        console.error(error)
    }
}

async function getAchievements(id, appid) {
    try {
        return await axios.get(
            'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/',
            {
                params: {
                    key: process.env.API_KEY,
                    steamid: id,
                    appid: appid,
                }
            }
        );
    } catch (error) {
        console.log("achievment FAIL");
        console.error(error)
    }
}

async function getGlobalStats(appid) {
    try {
        return await axios.get(
            'https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/',
            {
                params: {
                    key: process.env.API_KEY,
                    gameid: appid,
                }
            }
        );
    } catch (error) {
        console.log("percentage FAIL");
        console.error(error)
    }
}



//https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=1091500

//http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2

//https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/
