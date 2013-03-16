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
    },
    renderTemplate: function(controller) {
        this.render('stats', { controller: controller });
    }});

App.TodayController = Em.ArrayController.extend({
    content: [],
    title: 'Number of tags per team today',
    isLoading: false
});

App.MonthRoute = Em.Route.extend({
    setupController: function(controller) {
        var stats = [];
        $.ajax({
            type: 'GET',
            url: '/api/stats/month',
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
    },
    renderTemplate: function(controller) {
        this.render('stats', { controller: controller });
    }
});

App.MonthController = Em.ArrayController.extend({
    content: [],
    title: 'Number of tags per team this month',
    isLoading: false
});

App.StatsView = Em.View.extend({
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
            height = data.length * 20;
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
})