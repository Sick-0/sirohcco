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
        returnURL: 'http://localhost:8080/auth/steam/return',
        realm: 'http://localhost:8080/',
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
    secret: 'terces-sirohcco',
    name: 'sirohcco-session',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
server.use(passport.initialize());
server.use(passport.session());

//home route
server.get('/', function (req, res) {
    res.redirect("http://localhost:3000/");
});

//api home test
server.get('/api/home', function (req, res) {

    if (req.user) {
        res.send('Hallo ' + req.user.displayName);
    } else {
        res.send(' hello plz login :(');
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
    let allA = await getTheAllTogheterNow(req.user.id);
    console.log(allA);
    res.send(allA);
})

//get game detail
server.get('/api/game/', ensureAuthenticated, async function (req, res) {

    let detailG = await gameDetail(req.query.appid)
    console.log(detailG.data.availableGameStats);
    res.send(detailG.data);
})

//get achievement detail
server.get('/api/achievement/', ensureAuthenticated, async function (req, res) {

    let achievementG = await getAchievements(req.user.id, req.query.appid)
    console.log(achievementG.data);
    res.send(achievementG.data);
})

//get percentage detail
server.get('/api/percentage/', ensureAuthenticated, async function (req, res) {
    let percentageG = await getGlobalStats(req.query.appid)
    console.log(percentageG.data);
    res.send(percentageG.data);
})

//logout route
server.get('/logout', function (req, res) {
    req.logout();
    res.redirect('http://localhost:3000/');
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
        res.redirect("http://localhost:3000/account");
    });

server.listen(8080);

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
        console.error(error)
    }
}

//TODO improve and refactor
async function getTheAllTogheterNow(userId) {

    const allUser = await allGames(userId)

    let array = allUser.data.response.games;

    let filtered = Object.values(array).filter(array => array.has_community_visible_stats);

    const allAchievi = await getAllAchievements(filtered, userId);
    console.log(allAchievi);

    const globalAchievi = await getGlobalAchievements(filtered);

    //TODO extra call and join

    //need to call gamedetail as wel for the images of the achievements (gamedetail(appid);)

    let allClean = allAchievi.map(achi => {
        return achi.playerstats;
    })

    const arrs = [...filtered, ...globalAchievi];
    const noDuplicate = arr => [...new Set(arr)]
    const allIds = arrs.map(ele => ele.appid);
    const ids = noDuplicate(allIds);

    const result = ids.map(id =>
        arrs.reduce((self, item) => {
            return item.appid === id ?
                {...self, ...item} : self
        }, {})
    )

    const arrs2 = [...result, ...allClean];
    const noDuplicate2 = arr2 => [...new Set(arr2)]
    const allIds2 = arrs2.map(ele => ele.name);
    const ids2 = noDuplicate2(allIds2);

    const result2 = ids2.map(id =>
        arrs2.reduce((self, item) => {
            return item.name === id || item.gameName === id ?
                {...self, ...item} : self
        }, {})
    )


    result2.forEach(object => {
        object.achievements.forEach(function(achi, index) {
            object.achievements[index] = Object.assign(achi, search(achi.apiname, object.data.achievements));
        })
    })

    result2.forEach(object => {
        delete object.data;
    })

    return result2;
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}

async function getAllAchievements(arr, userId) {

    let achievementsToReturn = []
    let requests = arr.map(id => {
        //create a promise for each API call
        return getAchievements(userId, id.appid)
    });

    return await Promise.all(requests).then((body) => {
        //this gets called when all the promises have resolved/rejected.
        body.forEach(res => {
            console.log(res);
            if (res)
                achievementsToReturn.push(res.data)
        })
        console.log(achievementsToReturn);
        return achievementsToReturn;
    }).catch(err => console.log(err))
}

async function getGlobalAchievements(arr) {

    let achievementsToReturn = []
    let requests = arr.map(id => {
        //create a promise for each API call
        return getGlobalStats(id.appid)
    });

    return await Promise.all(requests).then((body) => {
        //this gets called when all the promises have resolved/rejected.
        body.forEach(res => {
            if (res)
            {
                achievementsToReturn.push({appid: res.config.params.gameid, data: res.data.achievementpercentages});
            }
        })
        return achievementsToReturn;
    }).catch(err => console.log(err))
}

//https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=1091500

//http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2

//https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/
