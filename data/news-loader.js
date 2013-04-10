var moment = require('moment'),
    _ = require('underscore'),
    espnApi = require('./espn-api'),
    redis = require('redis'),
    redisClient;

if(process.env.REDISTOGO_URL) {
    var rtg   = require('url').parse(process.env.REDISTOGO_URL);
    redisClient = redis.createClient(rtg.port, rtg.hostname);
    redisClient.auth(rtg.auth.split(':')[1]);
} else {
    redisClient = redis.createClient();
}

var convertToTeamIds = function(data) {
    var teamIds = []
    data.headlines.forEach(function(headline) {
        headline.categories.filter(function(cateory) {
                return !!cateory.teamId;
            })
            .map(function(category) {
                return category.teamId;
            }).forEach(function(id) {
                teamIds.push(id);
            });
    });
    return teamIds;
}

var getDay = function(options, callback) {
    var day = options.day,
        news = [];

    var loadNewsHandler = function(data) {

        var teamIds = convertToTeamIds(data.json);

        teamIds.forEach(function(teamId) {
            var existingTeamCount = _.find(news, function(n) {
                return n.id === teamId;
            });
            if(existingTeamCount) {
                existingTeamCount.count += 1;
            } else {
                news.push({ id: teamId, count: 1 });
            }
        });

        if(data.hasMorePages) {
            espnApi.load({ type: 'news', day: day, page: data.page + 1 }).then(loadNewsHandler);
        } else {
            callback(null, news);
        }
    };

    espnApi.load({ type: 'news', day: day, page: 1 }).then(loadNewsHandler);
}

var getCachedDay = function(options, callback) {
    var day = options.day,
        dayString = day.format('YYYYMMDD');

    redisClient.get(dayString, function(error, data) {
        if(data) {
            callback(null, JSON.parse(data));
        } else {
            getDay({ day: day }, function(error, data) {
                redisClient.set(dayString, JSON.stringify(data));
                callback(null, data);
            });
        }
    })
}

var getMonth = function(options, callback) {
    var day = moment(),
        news = [];

    var loadDayHandler = function(error, data) {
        data.forEach(function(d) {
            var existingTeamCount = _.find(news, function(n) {
                return n.id === d.id;
            });
            if(existingTeamCount) {
                existingTeamCount.count += d.count;
            } else {
                news.push({ id: d.id, count: d.count });
            }
        })
        if(day.date() === 1) {
            callback(null, news);
        } else {
            getCachedDay({ day: day.subtract('days', 1) }, loadDayHandler);
        }
    };

    getDay({ day: day }, loadDayHandler);
}

exports.today = function(callback) {
    getDay({ day: moment() }, callback);
};

exports.month = function(callback) {
    getMonth(null, callback);
};