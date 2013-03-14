var async = require('async'),
    request = require('request'),
    moment = require('moment');

var KEY = '42mwg9awhwjn8wb4rhps3efy',
    NEWS_API_ROOT = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/news/?apikey=' + KEY,
    LIMIT = 50;

var getNewsUrl = function(options) {
    var offset,
        url;

    offset = options.page ? ((options.page - 1) * LIMIT) : 0;
    url = NEWS_API_ROOT + '&limit=' + LIMIT + '&offset=' + offset + '&dates=' + options.day.format('YYYYMMDD');

    return url;
}

var load = function(options, callback) {

    var stats = options.stats || {},
        page = options.page || 1,
        type = options.type,
        day = options.day;

    request.get({ uri: getNewsUrl({ page: page, day: day }), json: true }, function(error, response, body) {

        body.headlines.forEach(function(headline) {
            headline.categories
                .filter(function(category) {
                    return !!category.teamId;
                })
                .map(function(category) {
                    return category.teamId;
                })
                .forEach(function(teamId) {
                    if(stats[teamId]) {
                        stats[teamId] += 1;
                    } else {
                        stats[teamId] = 1;
                    }
                });
        });

        if(body.resultsCount > (body.resultsLimit + body.resultsOffset)) {
            setTimeout(function() {
                page += 1;
                load({ stats: stats, page: page, day: day }, callback);
            }, 500);
        }
        else {
            if(type === 'day' || day.date() === 1) {
                callback(null, stats);
            } else {
                setTimeout(function() {
                    load({ stats: stats, page: 1, day: day.subtract('days', 1) }, callback);
                }, 500);

            }

        }
    });
}

var today = function(callback) {
    load({ type: 'day', day: moment() }, callback);
}

var month = function(callback) {
    load({ type: 'month', day: moment() }, callback);
}

exports.loader = {
    today: today,
    month: month
}