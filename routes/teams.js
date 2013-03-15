var teamsLoader = require('../data/teams');

exports.all = function(req, res) {
    teamsLoader.all([], 1, function(error, teams) {
        res.json(teams);
    });
}