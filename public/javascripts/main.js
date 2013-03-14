var App = Em.Application.create({});

App.Router.map(function() {
    this.route('today');
    this.route('month');
});

App.TeamStat = Em.Object.extend({
    id: 0,
    location: '',
    name: '',
    count: 0,

    displayName: function() {
        return this.get('location') + ' ' + this.get('name');
    }.property('location', 'name')
});

App.TodayRoute = Em.Route.extend({
    setupController: function(controller) {
        var stats = [];
        $.ajax({
            type: 'GET',
            url: '/api/stats',
            dataType: 'json',
            success: function(data) {
                data.forEach(function(d) {
                    stats.pushObject(App.TeamStat.create(d));
                })
                controller.set('content', stats);
            }
        });
    }
});

App.TodayController = Em.ArrayController.extend({
    content: [],
    sortProperties: ['count'],
    sortAscending: true
});

App.MonthRoute = Em.Route.extend({
    setupController: function(controller) {
        var stats = [];
        $.ajax({
            type: 'GET',
            url: '/api/stats/month',
            dataType: 'json',
            success: function(data) {
                data.forEach(function(d) {
                    stats.pushObject(App.TeamStat.create(d));
                })
                controller.set('content', stats);
            }
        });
    }
});

App.MonthController = Em.ArrayController.extend({
    content: [],
    sortProperties: ['count'],
    sortAscending: true
});