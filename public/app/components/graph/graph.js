angular.module('app.components.graph', [])
    .factory('TVGraph', function() {
        ////////////////////////////////////////////////

        /* BOARD SETTINGS */

        ////////////////////////////////////////////////
        var boardSettings = {
            width: 940,
            height: 400,
            padding: 50, // padding should be the area between the axis and the board
            getXMin: function() { return this.padding },
            getXMax: function() { return this.width - this.padding },
            getYMin: function() { return this.height - this.padding },
            getYMax: function() { return this.padding },
            getPointsRadius: function(totalEpisodes) {
                var widthPerPoint = this.width / totalEpisodes;
                if (widthPerPoint < 2) {
                    return 2;
                } else if (widthPerPoint > 10) {
                    return 10;
                } else {
                    return widthPerPoint;
                }
            },
            pointsDelayStart: 500,
            pointsDelayTotalTime: 2500,
            getPointsDelay: function(index, totalPoints) {
                return (this.pointsDelayTotalTime * index / totalPoints) + this.pointsDelayStart;
            }
        };
        ////////////////////////////////////////////////

        /* TV SHOW */

        ////////////////////////////////////////////////

        /* DRAW GRAPH FUNCTION */

        ////////////////////////////////////////////////
        var drawGraph = function(currentTVShow) {
            //This reveals data when you mouse over nodes.
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-55, 0])
                .html(function(d) {
                    return "<h3 class='title'>" + d.title + "</h3> <span class='episode-id'>Season " + d.seasonNumber + " Episode " + d.episodeNumber + "</span> <h1 class='rating'>" + d.rating + "</h1>" ;
                });

            //Define Graph Space, Initialize d3 (This sets how big the div is)
            d3.selectAll('svg')
                .remove();
            $('#graph').empty();

            var svg = d3.select('#graph')
                .append('svg')
                .attr('width', boardSettings.width)
                .attr('height', boardSettings.height);

            svg.call(tip);

            //Define Grid (inside), Initialize Scale and Axes of Graph (Using "g" element, tutorial here --> http://tutorials.jenkov.com/svg/g-element.html)
            /*x scale*/
            var xScale = d3.scale.linear()
                .domain([0, currentTVShow.episodes.length])
                .range([boardSettings.getXMin(), boardSettings.getXMax()]);

            /*y scale*/ //based on rating data set
            var yScale = d3.scale.linear()
                .domain([currentTVShow.sortedRatings[0].rating - 0.2, currentTVShow.sortedRatings[currentTVShow.sortedRatings.length - 1].rating + 0.1])
                .range([boardSettings.getYMin(), boardSettings.getYMax()]);

            /*x axis*/
            currentTVShow.xAxisIds = currentTVShow.xAxisIds.map(function(episodeNum) {
                return xScale(episodeNum);
            })
            currentTVShow.xAxisIds.unshift(boardSettings.getXMin());
            currentTVShow.xAxisIds.push(boardSettings.getXMax());
            currentTVShow.xAxisLabels.unshift("");
            currentTVShow.xAxisLabels.push("");

            var xAxisScale = d3.scale.ordinal()
                .domain(currentTVShow.xAxisLabels)
                .range(currentTVShow.xAxisIds);

            var xAxis = d3.svg.axis()
                .scale(xAxisScale)
                .orient('bottom')
                .outerTickSize(0);

            /*append x axis*/
            svg.append('g')
                .attr({
                    'class': 'x axis',
                    'transform': 'translate(0,' + boardSettings.getYMin() + ')',
                })
                .call(xAxis)
                .append("text")
                .attr("y", -20)
                .attr("x", boardSettings.width - 35)
                .attr("class", "anchor-text")
                .style("text-anchor", "end")
                .text("Season");

            /*y axis*/
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .outerTickSize(0);
            /*append y axis*/
            svg.append('g')
                .attr({
                    'class': 'y axis',
                    'transform': 'translate(' + boardSettings.getXMin() + ',0)'
                })
                .call(yAxis)
                .append("text")
                .attr("y", 5)
                .attr("x", 40)
                .attr("class", "anchor-text")
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("IMDB Rating");

            /*add points*/
            var points = svg.selectAll('circle')
                .data(currentTVShow.episodes)
                .enter()
                .append('circle')

            var opacityScale = d3.scale.linear()
                .domain([currentTVShow.sortedRatings[0].rating - 0.2, currentTVShow.sortedRatings[currentTVShow.sortedRatings.length - 1].rating + 0.1])
                .range([boardSettings.getYMax()/boardSettings.getYMin(), 1]);
            /*point attributes*/
            points.attr('cy', 0)
                .transition()
                .duration(100)
                .delay(function(d, i) {
                    return boardSettings.getPointsDelay(i, currentTVShow.sortedRatings.length);
                })
                .ease('elastic')
                .attr({
                    'cx': function(d) {
                        return xScale(d.id);
                    },
                    'cy': function(d) {
                        if (isNaN(d.rating)) {
                            return 0;
                        } else {
                            return yScale(d.rating);
                        }
                    },
                    'r': boardSettings.getPointsRadius(currentTVShow.episodes.length),
                    'class': 'graph-node',
                    'id': function(d, i) {
                        return i;
                    },
                })
                .style('opacity', function(d) {
                    return opacityScale(d.rating);
                })
                .style('display', function(d) {
                    if (isNaN(d.rating)) {
                        return "none"
                    }
                });
            
            var tipShown = false;
            svg.selectAll('circle').data(currentTVShow.episodes).on('mouseover', tip.show).on('mouseout', tip.hide);

            var drawTrendLine = function() {
                var x1 = 0;
                var y1 = 0;
                var x2 = 0;
                var y2 = 0;
                var len = currentTVShow.episodes.length;
                var xLabels = [];
                var ySeries = [];
                currentTVShow.episodes.forEach(function(episode) {
                    if (!isNaN(episode.rating)) {
                        x1 += episode.id;
                        y1 += episode.rating;
                        x2 += (episode.id * episode.rating);
                        y2 += (episode.id * episode.id);
                        xLabels.push(episode.id);
                        ySeries.push(episode.rating);
                    }
                })
                var xSeries = d3.range(1, xLabels.length + 1);

                var slope = (((len * x2) - (x1 * y1)) / ((len * y2) - (x1 * x1)))
                var intercept = ((y1 - (slope * x1)) / len)

                var a1 = xLabels[0];
                var b1 = slope + intercept;
                var a2 = xLabels[xLabels.length - 1];
                var b2 = slope * xSeries.length + intercept;
                var trendData = [
                    [a1, b1, a2, b2]
                ];
                var trendLine = svg.select()
                var trendline = svg.selectAll(".trendline")
                    .data(trendData);

                trendline.enter()
                    .append("line")
                    .attr("class", "trendline")
                    .attr("x1", function(d) {
                        return xScale(d[0]);
                    })
                    .attr("y1", function(d) {
                        return yScale(d[1]);
                    })
                    .attr("x2", function(d) {
                        return xScale(d[2]);
                    })
                    .attr("y2", function(d) {
                        return yScale(d[3]);
                    })
                    .style("stroke", "white")
            };
            // d3.select('#graph svg').text('');
            if (currentTVShow["name"]) {
                drawTrendLine();
            }
        };
        return {
            drawGraph: drawGraph
        };
    })
    .directive('graph', function($parse, $window) {
        return {
            restrict: 'EA',
            templateUrl: "/app/components/graph/graph.html",
            link: function(scope, elem, attrs) {}
        };
    });
