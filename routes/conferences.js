var teamsLoader = require('../data/teams-loader'),
    conferencesLoader = require('../data/conferences-loader');

exports.all = function(req, res) {
    teamsLoader.all(function(error, teams) {
        conferencesLoader.all(function(error, conferences) {
            var conferencesWithTeams = conferences.map(function(conference) {
                var teamsForConference = teams.filter(function(team) {
                    return conference.teams.indexOf(team.id) !== -1;
                });
                console.log(teamsForConference);
                return {
                    id: conference.id,
                    name: conference.name,
                    teams: teamsForConference
                };
            });
            res.json(conferencesWithTeams);
        });
    });
}