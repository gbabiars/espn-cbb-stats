var async = require('async'),
    request = require('request');

var KEY = '42mwg9awhwjn8wb4rhps3efy',
    TEAMS_API_ROOT = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/teams/?apikey=' + KEY,
    LIMIT = 50;


var getNewsUrl = function(page) {
    var offset = page ? ((page - 1) * LIMIT) : 0;
    var url = TEAMS_API_ROOT + '&limit=' + LIMIT + '&offset=' + offset;
    console.log(url);
    return url;
}

var load = function(teams, index, callback) {
    request.get({ uri: getNewsUrl(index), json: true }, function(error, response, body) {

        body.sports[0].leagues[0].teams
            .map(function(team) {
                return {
                    id: team.id,
                    location: team.location,
                    name: team.name,
                    abbreviation: team.abbreviation
                };
            })
            .forEach(function(team) {
                teams.push(team);
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

exports.get = function(req, res) {
    console.log(load);
    load([], 1, function(error, teams) {
        res.json(teams);
    });
}