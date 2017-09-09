/**
 * DotENV var which defined severals environment variables used throughout the server lifecycle
 */
require('dotenv').config();

/**
 * Catch all 'uncaughtException'
 */
process.on('uncaughtException', function (er) {
    console.log(('------> Fatal Error: ' + er).red);
    //process.exit(1);
});


/*************************************************************************************/


/**
 * Express framework which defined the routing mechanism
 */
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));

/**
 * BodyParser plugin that allowed to parse data into URL or parameter
 */
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Request configuration that allowed to performed corss-origin request
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Severals plugins to generate log with timestammp, colors & also generated daily logfile
 */
require('log-timestamp');
var colors = require('colors');
var dateFormat = require('dateformat');
var opts = {
    logDirectory: 'logs',
    fileNamePattern:'<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};
var log = require('simple-node-logger').createRollingFileLogger(opts);

/**
 * FS plugins that allowed to access to filesystem
 */
var fs = require('fs');

/**
 * Session plugins to enable session mechanism
 */
var session = require('express-session');
app.use(session({
    path: '/sessions',
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

/**
 * MySQL plugins and connection object declaration
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASWWORD,
    database: process.env.DB_INSTANCE
});

/**
 * HTTP plugins that allowed to performed http request trhoughout the server
 */
var http = require('http');

/*************************************************************************************/

app.get('/', function(req, res){
    res.redirect('V/index.html');
});

app.get('/api/object', function (req, res) {
        try {
            var request = 'SELECT * FROM objects;';
            connection.query(request, function (err, rows, fields) {    
                console.log(('SELECT all').green);  
                res.writeHead(200, { 'Content-Type': 'application/json'});
                res.end(JSON.stringify(rows));
                res.end();
            });
        }catch(err){
            console.log(('SELECT all').red);    
            res.end('Exception: ' + err.message);
        }
});

app.post('/api/object/modify/:name', function(req, res) {
    try {
        var request = 'SELECT * FROM objects WHERE name = "' + req.params.name + '" AND lat=' + req.query.lat + ' AND lon=' + req.query.lon + ';';
        connection.query(request, function (err, rows, fields) {    
            if (rows.length > 0) {
                var request = 'UPDATE objects SET strength=' + req.query.signal + ' WHERE name="' + req.params.name + '" AND lat=' + req.query.lat + ' AND lon=' + req.query.lon + ';';
                console.log(('UPDATE ' + req.params.name).green);
                log.info('UPDATE ' + req.params.name);
                try {
                    connection.query(request, function (err, rows, fields) {
                        
                    })
                    .on('end', function(){
                        res.end('0');
                    });
                }catch(err){            
                    console.log(('UPDATE ' + req.params.name).red); 
                    log.error('UPDATE ' + req.params.name);
                    res.end('Exception - 3: ' + err.message);
                }
            } else {
                var request = 'INSERT INTO objects (`lat`, `lon`, `name`, `strength`) VALUES(' + req.query.lat + ', ' + req.query.lon + ', "' + req.params.name + '", ' + req.query.signal + ');';
                console.log(('INSERT ' + req.params.name).green);
                log.info('INSERT ' + req.params.name)
                try {
                    connection.query(request, function (err, rows, fields) {
                        
                    })
                    .on('end', function(){
                        res.end('1');
                    });
                }catch(err){      
                    console.log(('INSERT ' + req.params.name).red);
                    log.error('INSERT ' + req.params.name);                 
                    res.end('Exception - 2: ' + err.message);
                }
            }
        });
    } catch (err) {
        console.log(('SELECT ' + req.params.name).red); 
        log.error('SELECT ' + req.params.name); 
        res.end('Exception - 1: ' + err.message);
    }
});

var start = require('./utils/start.js');
start.start();
start.startDatabase(connection);
app.listen(process.env.HTTP_PORT, function(){

});