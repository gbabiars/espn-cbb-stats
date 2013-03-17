var _ = require('underscore'),
    teamLoader = require('../data/teams-loader'),
    conferencesLoader = require('../data/conferences-loader'),
    newsLoader = require('../data/news-loader');

var convertToOutput = function(conferences, teams, news) {
    teams.forEach(function(team) {
        var existingTeam = _.find(news, function(n) {
            return n.id === team.id;
        })
        team.count = existingTeam ? existingTeam.count : 0;
    });

    var conferencesWithTeams = conferences.map(function(conference) {
        var teamsForConference = teams.filter(function(team) {
            return conference.teams.indexOf(team.id) !== -1;
        });

        return {
            id: conference.id,
            name: conference.name,
            count: teamsForConference.reduce(function(p, v) {
                p += v.count;
                return p;
            }, 0)
        };
    });

    return _.sortBy(conferencesWithTeams, function(c) {
        return -c.count;
    });
}

exports.today = function(req, res) {
    teamLoader.all(function(error, teams) {
        newsLoader.today(function(error, news) {
            conferencesLoader.all(function(error, conferences) {
                var result = convertToOutput(conferences, teams, news);

                res.json(result);
            });
        });
    });
}

exports.month = function(req, res) {
    teamLoader.all(function(error, teams) {
        newsLoader.month(function(error, news) {
            conferencesLoader.all(function(error, conferences) {
                var result = convertToOutput(conferences, teams, news);

                res.json(result);
            });
        });
    });
}