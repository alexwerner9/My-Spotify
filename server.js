var http = require('http');
var fetch = require('node-fetch');
var express = require('express');
var cors = require('cors');
var path = require('path');
const { renameSync } = require('fs');
const { response } = require('express');

var encoded = Buffer.from('d8f5f88f01a644ee803480f73bda4708:ccae11a4e8004f569057ac21549afdbe').toString('base64');
var id = 'd8f5f88f01a644ee803480f73bda4708';

var code = '';
var access_token = '';
var refresh_token = '';
var songData;

express()
    .use(express.static(__dirname))
    .use(cors())
    .set('views', __dirname)
    .set('view engine', 'ejs')
    .get('/spotifyauth/' + id, function(req, res) {
        setInterval(showCurrentSong, 1000);
        res.render('spotifyauth/started/requestauth');
    })
    .get('/updatesong', function(req,res) {
        res.send({
            'song':songData.item.name,
            'artist':songData.item.album.artists[0].name,
            'albumIMG':songData.item.album.images[1].url,
            'songURL':songData.item.album.external_urls.spotify
        });
    })
    .get('/getaccesstoken', function(req,res) {
        res.send(access_token)
    })
    .get('/', function(req,res) {
        if(!access_token) {
            parseSpotifyResponse(req);
        }
        res.render('body');
        res.end();
    })
    .listen(process.env.PORT || 80, () => console.log('Listening'));

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
        'redirect_uri': 'https://thawing-island-42941.herokuapp.com/',
        'client_id': 'd8f5f88f01a644ee803480f73bda4708',
        'client_secret': 'ccae11a4e8004f569057ac21549afdbe'
        })
    })
    .then(response => response.json())
    .then(function(data) {
        access_token = data.access_token;
        refresh_token = data.refresh_token;
        setTimeout(function() {
            console.log("in requestAccessToken");
            requestRefreshToken();
        }, (3540000));
        showCurrentSong();
    });

}

function requestRefreshToken() {
    console.log("Requesting new access code. Refresh token: " + refresh_token);
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
        console.log("data retrieved:");
        console.log(data);
        access_token = data.access_token;
        console.log("Refreshed access code: " + access_token);
        setTimeout(function() {
            console.log("Time almost expired. Calling refresh");
            requestRefreshToken();
        }, (3540000));
    });
}

function showCurrentSong() {
    console.log("requesting from API");
    fetch('https://api.spotify.com/v1/me/player', {
        headers: {
            'Authorization':'Bearer ' + access_token
        },
        json: true
    })
    .then(response => response.json())
    .then(function(data) {
        console.log("fetched update");
        songData = data;
    });
}