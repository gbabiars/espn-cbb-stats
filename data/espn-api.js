var request = require('request'),
    Q = require('q');

var roots,
    key,
    limit;

roots = {};
roots['teams'] = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/teams/';
roots['news'] = 'http://api.espn.com/v1/sports/basketball/mens-college-basketball/news';

key = '42mwg9awhwjn8wb4rhps3efy';

limit = 50;

var load = function(options) {
    var deferred = Q.defer(),
        page,
        type,
        offset,
        url;

    page = options.page || 1;
    type = options.type;
    offset = (page - 1) * limit

    url = roots[type] + '?apikey=' + key + '&limit=' + limit + '&offset=' + offset;

    if(type === 'news' && options.day) {
        url = url + '&dates=' + options.day.format('YYYYMMDD');
    }

    setTimeout(function() {
        request.get({ uri: url, json: true }, function(error, response, body) {
            if(error) {
                deferred.reject(new Error(error));
            } else {
                var hasMorePages = body.resultsCount > (body.resultsLimit + body.resultsOffset);
                deferred.resolve({ json: body, page: page, hasMorePages: hasMorePages });
            }
        })
    }, 200);

    return deferred.promise;
}

exports.load = load;