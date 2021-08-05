var fetch = require('node-fetch');
var express = require('express');
var app = express();
var cors = require('cors');
const { renameSync } = require('fs');
const { response } = require('express');

var id = process.env.SPOTIFY_ID;
var secret = process.env.SPOTIFY_SECRET;
var encoded = Buffer.from(id + ':' + secret).toString('base64');

var code = '';
var access_token = '';
var refresh_token = '';
var songData;

app.use(express.static(__dirname + '/front_end'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/spotifyauth/' + id, function(req, res) {
        setInterval(showCurrentSong, 1000);
        res.render('front_end/requestauth');
    });
app.get('/updatesong', function(req,res) {
        res.send({
            'song':songData.item.name,
            'artist':songData.item.album.artists[0].name,
            'albumIMG':songData.item.album.images[1].url,
            'songURL':songData.item.album.external_urls.spotify
        });
    });

app.get('/getaccesstoken', function(req,res) {
        res.send(access_token);
    });

app.get('/', function(req,res) {
        console.log("New visitor / refresh");
        if(!access_token) {
            parseSpotifyResponse(req);
        }
        res.render('front_end/body');
        res.end();
    });

app.post('/search', function(req,res) {
    console.log(req);
    res.send(req.body.input);
});

app.listen(process.env.PORT || 80, () => console.log('Listening'));

function parseSpotifyResponse(req) {
    var url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    code = url.searchParams.get("code");
    console.log('Spotify code retrieved: ' + code);
    requestAccessToken();
}

function requestAccessToken() {
    console.log('requesting access token');
    fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code, 
        'redirect_uri': 'http://www.alex-werner.com/',
        'client_id':id,
        'client_secret':secret
        })
    })
    .then(response => response.json())
    .then(function(data) {
        access_token = data.access_token;
        refresh_token = data.refresh_token;
        setTimeout(function() {
            requestRefreshToken();
        }, (3540000));
        showCurrentSong();
    });

}

function requestRefreshToken() {
    fetch('https://accounts.spotify.com/api/token', {
        method:'POST',
        headers: {
            'Authorization':'Basic ' + encoded
        },
        body: new URLSearchParams({
            'grant_type':'refresh_token',
            'refresh_token':refresh_token
        })
    })
    .then(response => response.json())
    .then(function(data) {
        access_token = data.access_token;
        setInterval(function() {
            requestRefreshToken();
        }, (3540000));
    });
}

function showCurrentSong() {
    fetch('https://api.spotify.com/v1/me/player', {
        headers: {
            'Authorization':'Bearer ' + access_token
        },
        json: true
    })
    .then(response => response.json())
    .then(function(data) {
        songData = data;
    });
}