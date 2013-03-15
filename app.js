
/**
 * Module dependencies.
 */

var express = require('express')
    http = require('http'),
    path = require('path'),
    stats = require('./routes/stats')
    teams = require('./routes/teams');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'hbs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.get('/api/stats', stats.today);
app.get('/api/stats/today', stats.today);
app.get('/api/stats/month', stats.month);
app.get('/api/teams', teams.all);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
