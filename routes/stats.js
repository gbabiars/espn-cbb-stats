var teamLoader = require('../data/teams').loader,
    statsLoader = require('../data/stats').loader;

exports.today = function(req, res) {
    teamLoader.all([], 1, function(error, teams) {
        statsLoader.today(function(error, stats) {
            teams.forEach(function(team) {
                team.count = stats[team.id] || 0;
            });
            res.json(teams);
        });
    });
}

exports.month = function(req, res) {
    teamLoader.all([], 1, function(error, teams) {
        statsLoader.month(function(error, stats) {
            teams.forEach(function(team) {
                team.count = stats[team.id] || 0;
            });
            res.json(teams);
        });
    });
}