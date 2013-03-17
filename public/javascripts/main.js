var App = Em.Application.create({});

App.Router.map(function() {
    this.route('teamsToday', { path: '/teams/today' });
    this.route('teamsByMonth', { path: '/teams/month' });
    this.route('conferencesToday', { path: '/conferences/today' });
    this.route('conferencesByMonth', { path: '/conferences/month' });
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

App.ConferenceStat = Em.Object.extend({
    id: '',
    name: '',
    count: 0
});

App.TeamsLoadMixin = Em.Mixin.create({
    loadAndSetTeamsAsContent: function(controller, url) {
        var stats = [];
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            beforeSend: function() {
                controller.set('isLoading', true);
            }
        }).done(function(data) {
                data.forEach(function(d) {
                    stats.pushObject(App.TeamStat.create(d));
                })
                controller.set('content', stats);
            })
            .always(function() {
                controller.set('isLoading', false);
            });
    }
});

App.TeamsTodayRoute = Em.Route.extend(App.TeamsLoadMixin, {
    setupController: function(controller) {
        this.loadAndSetTeamsAsContent(controller, '/api/news/by-team');
    },
    renderTemplate: function(controller) {
        this.render('teamsStats', { controller: controller });
    }});

App.TeamsTodayController = Em.ArrayController.extend({
    content: [],
    title: 'Number of tags per team today',
    isLoading: false
});

App.TeamsByMonthRoute = Em.Route.extend(App.TeamsLoadMixin, {
    setupController: function(controller) {
        this.loadAndSetTeamsAsContent(controller, '/api/news/by-team/month');
    },
    renderTemplate: function(controller) {
        this.render('teamsStats', { controller: controller });
    }
});

App.TeamsByMonthController = Em.ArrayController.extend({
    content: [],
    title: 'Number of tags per team this month',
    isLoading: false
});

App.ConferencesLoadMixin = Em.Mixin.create({
    loadAndSetConferencesAsContent: function(controller, url) {
        var stats = [];
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            beforeSend: function() {
                controller.set('isLoading', true);
            }
        }).done(function(data) {
                data.forEach(function(d) {
                    stats.pushObject(App.ConferenceStat.create(d));
                })
                controller.set('content', stats);
            })
            .always(function() {
                controller.set('isLoading', false);
            });
    }
})

App.ConferencesTodayRoute = Em.Route.extend(App.ConferencesLoadMixin, {
    setupController: function(controller) {
        this.loadAndSetConferencesAsContent(controller, '/api/news/by-conference');
    },
    renderTemplate: function(controller) {
        this.render('conferencesStats', { controller: controller });
    }
});

App.ConferencesTodayController = Em.ArrayController.extend({
    content: [],
    title: 'Number of tags per conference today',
    isLoading: false
});

App.ConferencesByMonthRoute = Em.Route.extend(App.ConferencesLoadMixin, {
    setupController: function(controller) {
        this.loadAndSetConferencesAsContent(controller, '/api/news/by-conference/month');
    },
    renderTemplate: function(controller) {
        this.render('conferencesStats', { controller: controller });
    }
});

App.ConferencesByMonthController = Em.ArrayController.extend({
    content: [],
    title: 'Number of tags per conference this month',
    isLoading: false
});

App.TeamsStatsView = Em.View.extend({
    contentChanged: function() {
        var data,
            options,
            height;

        if(this.get('controller.content')) {
            data = this.get('controller.content').map(function(d) {
                return {
                    label: d.get('displayName'),
                    value: d.get('count')
                };
            });
            options = [{
                key: '# of stories',
                color: '#1f77b4',
                values: data
            }];
            height = data.length * 20 + 200;
            this.$().find('#chart svg').css({ height: height + 'px' });
            nv.addGraph(function() {
                var chart = nv.models.multiBarHorizontalChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .margin({ top: 30, right: 20, bottom: 50, left: 250 })
                    .showValues(true)
                    .tooltips(false)
                    .showControls(false);

                d3.select('#chart svg')
                    .datum(options)
                    .transition().duration(500)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        }
    }.observes('controller.content')
});

App.ConferencesStatsView = Em.View.extend({
    contentChanged: function() {
        var data,
            options,
            height;

        if(this.get('controller.content')) {
            data = this.get('controller.content').map(function(d) {
                return {
                    label: d.get('name'),
                    value: d.get('count')
                };
            });
            options = [{
                key: '# of stories',
                color: '#1f77b4',
                values: data
            }];
            height = data.length * 20 + 200;
            this.$().find('#chart svg').css({ height: height + 'px' });
            nv.addGraph(function() {
                var chart = nv.models.multiBarHorizontalChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .margin({ top: 30, right: 20, bottom: 50, left: 100 })
                    .showValues(true)
                    .tooltips(false)
                    .showControls(false);

                d3.select('#chart svg')
                    .datum(options)
                    .transition().duration(500)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        }
    }.observes('controller.content')
});