var teamsLoader = require('../data/teams-loader');

exports.all = function(req, res) {
    teamsLoader.all(function(error, teams) {
        res.json(teams);
    });
}