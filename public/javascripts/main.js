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
        controller.set('nameField', 'location');
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
        controller.set('title', 'Number of tags per team today');
        this.loadAndSetTeamsAsContent(controller, '/api/news/by-team');
    },
    renderTemplate: function(controller) {
        this.render('statsChart', { controller: controller });
    }});

App.TeamsByMonthRoute = Em.Route.extend(App.TeamsLoadMixin, {
    setupController: function(controller) {
        controller.set('title', 'Number of tags per team this month');
        this.loadAndSetTeamsAsContent(controller, '/api/news/by-team/month');
    },
    renderTemplate: function(controller) {
        this.render('statsChart', { controller: controller });
    }
});

App.ConferencesLoadMixin = Em.Mixin.create({
    loadAndSetConferencesAsContent: function(controller, url) {
        var stats = [];
        controller.set('nameField', 'name');
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
        controller.set('title', 'Number of tags per conference today');
        this.loadAndSetConferencesAsContent(controller, '/api/news/by-conference');
    },
    renderTemplate: function() {
        this.render('statsChart', { controller: 'conferencesToday' });
    }
});

App.ConferencesByMonthRoute = Em.Route.extend(App.ConferencesLoadMixin, {
    setupController: function(controller) {
        controller.set('title', 'Number of tags per conference this month');
        this.loadAndSetConferencesAsContent(controller, '/api/news/by-conference/month');
    },
    renderTemplate: function(controller) {
        this.render('statsChart', { controller: controller });
    }
});

App.StatsChartView = Em.View.extend({
    contentChanged: function() {
        var data,
            nameField,
            containerWidth,
            margin,
            width,
            height,
            max,
            x,
            y,
            svg,
            chartContainer;

        if(this.get('controller.content')) {
            data = this.controller.get('content');
            nameField = this.controller.get('nameField');

            containerWidth = this.$('.container').width();

            margin = {top: 10, right: 20, bottom: 10, left: 180};
            width = containerWidth - margin.left - margin.right;
            height = data.length * 20;

            max = d3.max(data, function(d) {
                return d.count;
            });

            x = d3.scale.linear()
                .domain([0, max])
                .range([0, width])
                .nice();

            y = d3.scale.ordinal()
                .domain(d3.range(data.length))
                .rangeBands([0, height], .2);

            svg = d3.select('#chart').append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)

            chartContainer = svg
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            chartContainer.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function() { return x(0); })
                .attr('y', function(d, i) { return y(i); })
                .attr('height', y.rangeBand())
                .transition()
                .duration(300)
                .attr('width', function(d) { return x(d.count); });

            chartContainer
                .append('g')
                .selectAll('text')
                .data(data)
                .enter().append('text')
                .attr('x', function(d) { return x(d.count); })
                .attr('y', function(d, i) { return y(i) + y.rangeBand() / 2; })
                .attr('dx', 3) // padding-right
                .attr('dy', '.35em') // vertical-align: middle
                .attr('text-anchor', 'start') // text-align: right
                .text(function(d) { return d.count; })
                .attr('visibility', 'hidden')
                .transition()
                .delay(300)
                .attr('visibility', 'visible');

            chartContainer
                .append('g')
                .attr('class', 'axis')
                .selectAll('text')
                .data(data)
                .enter().append('text')
                .attr('x', 0)
                .attr('y', function(d, i) { return y(i) + y.rangeBand() / 2; })
                .attr('dx', -3) // padding-right
                .attr('dy', '.35em') // vertical-align: middle
                .attr('text-anchor', 'end') // text-align: right
                .text(function(d) { return d[nameField]; });

            chartContainer.append('g')
                .attr('class', 'y axis')
                .append('line')
                .attr('x1', x(0))
                .attr('x2', x(0))
                .attr('y1', 0)
                .attr('y2', height);
        }
    }.observes('controller.content')
});