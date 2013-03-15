var espnApi = require('./espn-api');

var load = function(teams, index, callback) {

    espnApi.load({ type: 'teams', page: index }, function(error, body) {
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

exports.all = load;