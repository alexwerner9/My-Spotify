var http = require('http');
var nodefetch = require('node-fetch');
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
        console.log(code);
        res.end();
    })
    .listen(process.env.PORT || 80, () => console.log('Listening'));

function parseSpotifyResponse(req, s) {
    var url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    code = url.searchParams.get("code");
    console.log(code);
}