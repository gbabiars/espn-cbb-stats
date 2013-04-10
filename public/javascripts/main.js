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
        if(this.get('controller.content')) {
            var data = this.controller.get('content');

            var containerWidth = this.$('.container').width();

            var margin = {top: 10, right: 20, bottom: 10, left: 180},
                width = containerWidth - margin.left - margin.right,
                height = 7200 - margin.top - margin.bottom;

            var max = d3.max(data, function(d) {
                return d.count;
            });

            var x = d3.scale.linear()
                .domain([0, max])
                .range([0, width])
                .nice();

            var y = d3.scale.ordinal()
                .domain(d3.range(data.length))
                .rangeBands([0, height], .2);

            var svg = d3.select('#chart').append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            var chartContainer = svg
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            chartContainer.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function() { return x(0); })
                .attr("y", function(d, i) { return y(i); })
                .attr("height", y.rangeBand())
                .transition()
                .duration(300)
                .attr("width", function(d) { return x(d.count); });

            chartContainer
                .append('g')
                .selectAll("text")
                .data(data)
                .enter().append("text")
                .attr("x", function(d) { return x(d.count); })
                .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
                .attr("dx", 3) // padding-right
                .attr("dy", ".35em") // vertical-align: middle
                .attr("text-anchor", "start") // text-align: right
                .text(function(d) { return d.count; })
                .attr('visibility', 'hidden')
                .transition()
                .delay(300)
                .attr('visibility', 'visible');

            chartContainer
                .append('g')
                .attr('class', 'axis')
                .selectAll("text")
                .data(data)
                .enter().append("text")
                .attr("x", 0)
                .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
                .attr("dx", -3) // padding-right
                .attr("dy", ".35em") // vertical-align: middle
                .attr("text-anchor", "end") // text-align: right
                .text(function(d) { return d.location; });

            chartContainer.append("g")
                .attr("class", "y axis")
                .append("line")
                .attr("x1", x(0))
                .attr("x2", x(0))
                .attr("y1", 0)
                .attr("y2", height);
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