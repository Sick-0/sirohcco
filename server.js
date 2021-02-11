var express = require('express')
    , passport = require('passport')
    , util = require('util')
    , session = require('express-session')
    , SteamStrategy = require('passport-steam').Strategy;

const path = require('path');

var cors = require('cors')
require('dotenv').config();

const getGlobalStats = require('./helpers/getGlobalStats');
const allGames = require('./helpers/allGames');
const gameDetail = require('./helpers/gameDetail');
const getAchievements = require('./helpers/getAchievements');
const getAllAchievements = require('./helpers/getAllAchievements');



// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
        returnURL: process.env.RETURN_URL,
        realm: process.env.REALM,
        apiKey: process.env.API_KEY
    },
    function (identifier, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(() => {

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
    secret: process.env.SECRET,
    name: process.env.NAME,
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize());
server.use(passport.session());

server.use(express.static(path.join(__dirname, "build/")));

//api home test
server.get('/api/home', function (req, res) {

    if (req.user) {
        res.send('Hallo ' + req.user.displayName);
    } else {
        res.send('Hello plz login :(');
    }
});

//get account details
server.get('/api/account', ensureAuthenticated, function (req, res) {
    res.send({user: req.user});
});

//check if allowed
server.get('/api/check', function (req, res) {
    if (req.user) {
        res.send({user: req.user});
    } else {
        res.status(400).send({
            message: 'NOT ALLOWED YA FUDGER'
        });
    }

});

//get all games
server.get('/api/allgames', ensureAuthenticated, async function (req, res) {
    console.log('allgames ROUTE hit');
    let allG = await allGames(req.user.id);
    res.send(allG.data.response.games);
})

server.get('/api/allachievements', ensureAuthenticated, async function (req, res) {
    console.log('all achievements ROUTE hit');
    let allA = await getAllAchievements(req.user.id);
    res.send(allA);
})

//get game detail
server.get('/api/game/', ensureAuthenticated, async function (req, res) {

    let detailG = await gameDetail(req.query.appid)
    res.send(detailG.data);
})

//get achievement detail
server.get('/api/achievement/', ensureAuthenticated, async function (req, res) {

    let achievementG = await getAchievements(req.user.id, req.query.appid)
    res.send(achievementG.data);
})

//get percentage detail
server.get('/api/percentage/', ensureAuthenticated, async function (req, res) {
    let percentageG = await getGlobalStats(req.query.appid)
    res.send(percentageG.data);
})

//logout route
server.get('/logout', function (req, res) {
    req.logout();
    res.redirect( process.env.HOMEPAGE);
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
server.get('/auth/steam',
    passport.authenticate('steam', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/account');
    });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
server.get('/auth/steam/return',
    passport.authenticate('steam', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect(process.env.HOMEPAGE);
    });

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

server.use((req, res) => {
    res.status(404).json({message: 'Route Not Found'});
});

server.listen(process.env.PORT );

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
