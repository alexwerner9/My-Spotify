var http = require('http');
var nodefetch = require('node-fetch');
var express = require('express');

express()
    .get('/', (req, res) => res.render(body.html))
    .listen(process.env.PORT || 80, () => console.log('Listening'));