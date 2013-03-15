var moment = require('moment'),
    espnApi = require('./espn-api');

var load = function(options, callback) {

    var stats = options.stats || {},
        page = options.page || 1,
        type = options.type,
        day = options.day;

    espnApi.load({ type: 'news', page: page, day: day.format('YYYYMMDD')}, function(error, body) {

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

exports.today = today;
exports.month = month;