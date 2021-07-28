var http = require('http');
var fetch = require('node-fetch');
var express = require('express');
var path = require('path');
const { renameSync } = require('fs');

var code = '';

function parseReqURL(url) {
    console.log(url);
}

express()
    .use(express.static(__dirname))
    .set('views', __dirname)
    .set('view engine', 'ejs')
    .get('/', function(req, res) {
        console.log(req.url);
        res.render('body');
    })
    .get('/spotifyauth', function(req,res) {
        console.log('in auth');
        parseSpotifyResponse(req, res);
        res.render('spotifyauth/spotify');
        res.end();
    })
    .listen(process.env.PORT || 80, () => console.log('Listening'));

function parseSpotifyResponse(req, s) {
    var url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    code = url.searchParams.get("code");
    console.log('Code retrieved');
    requestAccessToken();
    console.log(code);
}

function requestAccessToken() {
    fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Authorization': 'Basic *<d8f5f88f01a644ee803480f73bda4708:ccae11a4e8004f569057ac21549afdbe>*'
    },
    body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': "https%3A%2F%2Fthawing-island-42941.herokuapp.com%2Fspotifyauth%2F",
        'client_id': 'd8f5f88f01a644ee803480f73bda4708',
        'client_secret': 'ccae11a4e8004f569057ac21549afdbe'
        })
    })
    .then(response => response.json())
    .then(data => console.log(data));

}