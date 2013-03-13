var async = require('async'),
    request = require('request'),
    moment = require('moment');

var KEY = '42mwg9awhwjn8wb4rhps3efy',
    NEWS_API_ROOT = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/news/',
    LIMIT = 50;

var getNewsUrl = function(offset) {
    offset = offset || 0;
    var url = NEWS_API_ROOT + '?apikey=' + KEY + '&limit=' + LIMIT + '&offset=' + offset + '&dates=' + getToday();
    console.log(url);
    return url;
}

var getToday = function() {
    var day = new moment().format('YYYYMMDD');
    return day;
}

exports.get = function(req, res) {
    request.get({ uri: getNewsUrl(), json: true }, function(error, response, body) {
        var teams = [];
        body.headlines.forEach(function(headline) {
            headline.categories
                .filter(function(category) {
                    return !!category.teamId;
                })
                .map(function(category) {
                    return category.teamId;
                })
                .forEach(function(teamId) {
                    teams.push(teamId);
                });
        });
        res.json({ teams: teams });
    })
}