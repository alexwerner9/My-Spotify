var http = require('http');
var nodefetch = require('node-fetch');
var express = require('express');
var path = require('path');

express()
    .use(express.static(__dirname))
    .set('views', __dirname)
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('body'))
    .listen(process.env.PORT || 80, () => console.log('Listening'));