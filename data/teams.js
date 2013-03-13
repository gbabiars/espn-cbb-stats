//var async = require('async'),
//    request = require('request');
//
//var KEY = '42mwg9awhwjn8wb4rhps3efy',
//    TEAMS_API_ROOT = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/teams/?apikey=' + KEY,
//    LIMIT = 50;
//
//var load = function(callback) {
//    request.get({ uri: getNewsUrl(0), json: true }, function(error, response, body) {
//        var teams = [];
//        body.sports.leagues.teams.forEach(function(team) {
//            console.log(team);
//        });
//    });
//}
//
//var getNewsUrl = function(page) {
//    offset = page ? ((page - 1) * LIMIT) : 0;
//    var url = TEAMS_API_ROOT + '&limit=' + LIMIT + '&offset=' + offset;
//    return url;
//}
//
//exports.get = function(req, res) {
////    request.get({ uri: getNewsUrl(0), json: true }, function(error, response, body) {
////        var teams = [];
////        body.headlines.forEach(function(headline) {
////            headline.categories
////                .filter(function(category) {
////                    return !!category.teamId;
////                })
////                .map(function(category) {
////                    return category.teamId;
////                })
////                .forEach(function(teamId) {
////                    teams.push(teamId);
////                });
////        });
////        res.json({ teams: teams });
////    })
//    load(function(error, teams) {
//        res.json(teams);
//    });
//}