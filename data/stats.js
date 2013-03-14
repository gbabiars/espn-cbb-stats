var async = require('async'),
    request = require('request'),
    moment = require('moment');

var KEY = '42mwg9awhwjn8wb4rhps3efy',
    NEWS_API_ROOT = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/news/?apikey=' + KEY,
    LIMIT = 50;

var day = new moment().format('YYYYMMDD');

var getNewsUrl = function(options) {
    options = options || {};
    var offset = options.page ? ((options.page - 1) * LIMIT) : 0;
    var url = NEWS_API_ROOT + '&limit=' + LIMIT + '&offset=' + offset + '&dates=' + day;
    return url;
}

var load = function(teams, index, callback) {
    var options = {
        page: index
    };
    request.get({ uri: getNewsUrl(options), json: true }, function(error, response, body) {

        body.headlines.forEach(function(headline) {
            headline.categories
                .filter(function(category) {
                    return !!category.teamId;
                })
                .map(function(category) {
                    return category.teamId;
                })
                .forEach(function(teamId) {
                    if(teams[teamId]) {
                        teams[teamId] += 1;
                    } else {
                        teams[teamId] = 1;
                    }
                });
        });

        if(body.resultsCount > (body.resultsLimit + body.resultsOffset)) {
            setTimeout(function() {
                index += 1;
                load(teams, index, callback);
            }, 200);
        }
        else {
            callback(null, teams);
        }
    });
}

exports.loader = {
    today: load
}