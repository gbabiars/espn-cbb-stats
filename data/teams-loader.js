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

var convertToTeams = function(data) {
    return data.sports[0].leagues[0].teams
        .map(function(team) {
            return {
                id: team.id,
                location: team.location,
                name: team.name,
                abbreviation: team.abbreviation
            };
        });
}

var getTeams = function(options, callback) {

    var teams = [];

    var loadTeamsHandler = function(error, data) {
        var convertedTeams = convertToTeams(data.json);

        convertedTeams.forEach(function(team) {
            teams.push(team);
        });

        if(data.hasMorePages) {
            espnApi.load({ type: 'teams', page: data.page + 1 }, loadTeamsHandler);
        } else {
            callback(null, teams);
        }
    }

    espnApi.load({ type: 'teams', page: 1 }, loadTeamsHandler);

}

var getCachedTeams = function(options, callback) {

    redisClient.get('teams', function(error, data) {
        if(data) {
            callback(null, JSON.parse(data));
        } else {
            getTeams(null, function(error, data) {
                redisClient.set('teams', JSON.stringify(data));
                callback(null, data);
            });
        }
    })

}

exports.all = function(callback) {
    getCachedTeams(null, callback);
};