var http = require('http');
var fetch = require('node-fetch');
var express = require('express');
var path = require('path');
const { renameSync } = require('fs');
const { response } = require('express');

var code = '';
var access_token = '';
var songData;

function parseReqURL(url) {
    console.log(url);
}

express()
    .use(express.static(__dirname))
    .set('views', __dirname)
    .set('view engine', 'ejs')
    .get('/spotifyauth/start', function(req, res) {
        console.log(req.url);
        res.render('spotifyauth/started/requestauth', {
            testVar:'this is a test'
        });
    })
    .get('/requestsong', function(req,res) {
        showCurrentSong();
        res.send(songData.item.name);
        console.log("updated");
    })
    .get('/updatesong', function(req,res) {
        res.render('body', {
            song:songData.item.name
        })
    })
    .get('/spotifyauth', function(req,res) {
        console.log('in auth');
        if(!access_token) {
            parseSpotifyResponse(req);
        }
        if(songData && songData.item && songData.item.name) {
            console.log("there is song data");
            res.render('body', {
                song:songData.item.name
            });
        } else {
            console.log("there is no song data");
            res.render('body', {
                song:'Loading song ...'
            });
        }
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
    var encoded = Buffer.from('d8f5f88f01a644ee803480f73bda4708:ccae11a4e8004f569057ac21549afdbe').toString('base64');
    fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code, 
        'redirect_uri': 'https://thawing-island-42941.herokuapp.com/spotifyauth/',
        'client_id': 'd8f5f88f01a644ee803480f73bda4708',
        'client_secret': 'ccae11a4e8004f569057ac21549afdbe'
        })
    })
    .then(response => response.json())
    .then(function(data) {
        access_token = data.access_token;
        console.log('access token' + access_token);
        showCurrentSong();
    });

}

function showCurrentSong() {
    console.log(access_token);
    fetch('	https://api.spotify.com/v1/me/player', {
        headers: {
            'Authorization':'Bearer ' + access_token
        },
        json: true
    })
    .then(response => response.json())
    .then(function(data) {
        songData = data;
        console.log('name ' + songData.item.name);
        fetch('https://thawing-island-42941.herokuapp.com/spotifyauth/');
    });
}