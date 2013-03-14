var loadTeams = require('../data/teams').all;

exports.get = function(req, res) {
    loadTeams([], 1, function(error, teams) {
        res.json(teams);
    });
}