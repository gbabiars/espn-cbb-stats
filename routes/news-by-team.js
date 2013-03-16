var _ = require('underscore'),
    teamLoader = require('../data/teams-loader'),
    newsLoader = require('../data/news-loader');

exports.today = function(req, res) {
    teamLoader.all(function(error, teams) {
        newsLoader.today(function(error, news) {
            teams.forEach(function(team) {
                var existingTeam = _.find(news, function(n) {
                    return n.id === team.id;
                })
                team.count = existingTeam ? existingTeam.count : 0;
            });
            res.json(_.sortBy(teams, function(t) {
                return -t.count;
            }));
        });
    });
}

exports.month = function(req, res) {
    teamLoader.all(function(error, teams) {
        newsLoader.month(function(error, news) {
            teams.forEach(function(team) {
                var existingTeam = _.find(news, function(n) {
                    return n.id === team.id;
                })
                team.count = existingTeam ? existingTeam.count : 0;
            });
            res.json(_.sortBy(teams, function(t) {
                return -t.count;
            }));
        });
    });
}