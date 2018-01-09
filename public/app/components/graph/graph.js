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
            }
        };
        ////////////////////////////////////////////////

        /* TV SHOW */

        ////////////////////////////////////////////////
        var initializeTVShowDefaults = function(currentTVShow) {
            currentTVShow = currentTVShow || {};
            currentTVShow.episodeCount = 1;
            currentTVShow.episodesList = [];
            currentTVShow.seasonCount = 1;
            currentTVShow.xAxisLabels = [];
            currentTVShow.seasonStarters = [];
            currentTVShow.ratingsList = [];
            return currentTVShow;
        }

        ////////////////////////////////////////////////

        /* DRAW GRAPH FUNCTION */

        ////////////////////////////////////////////////
        var drawGraph = function(currentTVShow) {


            currentTVShow = initializeTVShowDefaults(currentTVShow);

            var seasons = currentTVShow["Seasons"] || {};
            if (seasons) {
                for (var seasonNumber in seasons) {
                    var season = seasons[seasonNumber];
                    season.forEach(function(episode) {
                        if (episode["imdbRating"] !== "N/A") {
                            //get episode data
                            var epNum = parseInt(episode["Episode"]);
                            var rating = parseFloat(episode["imdbRating"]);
                            var episodeTitle = episode["Title"];
                            var season = parseInt(seasonNumber);
                            //fill the d3 dataset variables
                            if (epNum == 1) {
                                currentTVShow.seasonStarters.push(currentTVShow.episodeCount);
                                currentTVShow.xAxisLabels.push(season);
                            }
                            var episodeObj = {
                                id: currentTVShow.episodeCount,
                                rating: rating,
                                title: episodeTitle,
                                season: season,
                                episode: epNum
                            }
                            currentTVShow.episodesList.push(episodeObj);
                            currentTVShow.ratingsList.push(rating);
                            currentTVShow.episodeCount++;
                        }
                    })
                }
            }


            //This reveals data when you mouse over nodes.
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-55, 0])
                .html(function(d) {
                    return "<h3 class='title'>" + d.title + "</h3> <span class='episode-id'>Season " + d.season + " Episode " + d.episode + "</span> <h1 class='rating'>" + d.rating + "</h1>" ;
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
                .domain([0, currentTVShow.episodesList.length])
                .range([boardSettings.getXMin(), boardSettings.getXMax()]);

            /*y scale*/ //based on rating data set
            currentTVShow.ratingsList.sort();
            var yScale = d3.scale.linear()
                .domain([currentTVShow.ratingsList[0] - 0.2, currentTVShow.ratingsList[currentTVShow.ratingsList.length - 1] + 0.1])
                .range([boardSettings.getYMin(), boardSettings.getYMax()]);

            /*x axis*/
            currentTVShow.seasonStarters = currentTVShow.seasonStarters.map(function(episodeNum) {
                return xScale(episodeNum);
            })
            currentTVShow.seasonStarters.unshift(boardSettings.getXMin());
            currentTVShow.seasonStarters.push(boardSettings.getXMax());
            currentTVShow.xAxisLabels.unshift("");
            currentTVShow.xAxisLabels.push("");

            var xAxisScale = d3.scale.ordinal()
                .domain(currentTVShow.xAxisLabels)
                .range(currentTVShow.seasonStarters);

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
                .data(currentTVShow.episodesList)
                .enter()
                .append('circle')

            var opacityScale = d3.scale.linear()
                .domain([currentTVShow.ratingsList[0] - 0.2, currentTVShow.ratingsList[currentTVShow.ratingsList.length - 1] + 0.1])
                .range([boardSettings.getYMax()/boardSettings.getYMin(), 1]);
            /*point attributes*/
            points.attr('cy', 0)
                .transition()
                .duration(100)
                .delay(function(d, i) {
                    return (i * 100) + 500;
                })
                .ease('elastic')
                .attr({
                    'cx': function(d) {
                        return xScale(d.id);
                    },
                    'cy': function(d) {
                        return yScale(d.rating);
                    },
                    'r': boardSettings.getPointsRadius(currentTVShow.episodeCount),
                    'class': 'graph-node',
                    'id': function(d, i) {
                        return i;
                    },
                })
                .style('opacity', function(d) {
                    return opacityScale(d.rating);
                });
            
            var tipShown = false;
            svg.selectAll('circle').data(currentTVShow.episodesList).on('mouseover', tip.show).on('mouseout', tip.hide);

            var drawTrendLine = function() {
                var x1 = 0;
                var y1 = 0;
                var x2 = 0;
                var y2 = 0;
                var len = currentTVShow.episodesList.length;
                var xLabels = [];
                var ySeries = [];
                currentTVShow.episodesList.forEach(function(episode) {
                    x1 += episode.id;
                    y1 += episode.rating;
                    x2 += (episode.id * episode.rating);
                    y2 += (episode.id * episode.id);
                    xLabels.push(episode.id);
                    ySeries.push(episode.rating);
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
            //d3.select('#graph svg').text('');
            if (currentTVShow["Title"] !== undefined) {
                drawTrendLine();
            }
        };
        return {
            initializeTVShowDefaults: initializeTVShowDefaults,
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
