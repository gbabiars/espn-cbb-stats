var teamLoader = require('../data/teams').loader,
    statsLoader = require('../data/stats').loader;

exports.get = function(req, res) {
    teamLoader.all([], 1, function(error, teams) {
        statsLoader.today({}, 1, function(error, stats) {
            teams.forEach(function(team) {
                team.count = stats[team.id] || 0;
            });
            res.json(teams);
        });
    });
}