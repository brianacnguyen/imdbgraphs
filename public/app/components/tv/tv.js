// settings
var boardSettings = {
    width: 1100,
    height: 400,
    padding: 25,
    getXMin: function() {return this.padding},
    getXMax: function() {return this.width - this.padding},
    getYMin: function() {return this.height - this.padding},
    getYMax: function() {return this.padding}
};
// data
var data_url = {};
var epId = 1;
// for episode ratings
var episodedataset = [];
// for all ratings, to scale axis
var ratingdataset = [];
var infoset = [];
var showName = '';
var seasonAvg = [];
var totalSeasons = 1;
var firstEpisodes = [];
var xAxisLabels = [];

angular.module('app.components.tv', [])
    .controller("TVController", function($scope, $stateParams, OMDBAPI) {
        $scope.tvRatings = {};
        var getTVRatings = function(imdbID, resultsObj, currentSeason) {
            currentSeason = currentSeason || 1;
            if (currentSeason <= totalSeasons) {
                OMDBAPI.getTVSeasonRatings(imdbID, currentSeason).then(function(resp) {
                    resultsObj['Title'] = resp['Title'];
                    if (!resultsObj['Seasons']) {
                        resultsObj['Seasons'] = {};
                    }
                    resultsObj['Seasons'][currentSeason.toString()] = resp["Episodes"];
                    totalSeasons = parseInt(resp["totalSeasons"]);
                    currentSeason = parseInt(resp["Season"]);
                    getTVRatings(imdbID, resultsObj, currentSeason + 1)
                    data_url = resultsObj;
                    if (currentSeason == totalSeasons) {
                        drawGraph();
                    }
                })
            }
        }
        getTVRatings($stateParams.imdbID, $scope.tvRatings);
    })
    .directive('graph', function($parse, $window) {
        return {
            restrict: 'EA',
            template: '<section class="graph"><div id="graph"></div></section>',
            link: function(scope, elem, attrs) {
            }
        };
    });

var drawGraph = function() {

    //clear datasets if graphing new show changed
    if (data_url['Title'] !== showName) {
        console.log('reset');
        epId = 1;
        episodedataset = [];
        ratingdataset = [];
        infoset = [];
        firstEpisodes = [];
        xAxisLabels = [];
    }
    //update showName
    showName = data_url['Title'];


    //Function for filling up the info dataset
    //Function for filling up the episode dataset
    //iterate over episodes and add data to d3 datasets
    var seasons = data_url["Seasons"] || {};
    if (seasons) {
        ratingdataset = [];
        infoset = [];
        seasonAvg = [];
        firstEpisodes = [];
        xAxisLabels = [];
        epId = 1;
        for (var seasonNumber in seasons) {
            var season = seasons[seasonNumber];
            season.forEach(function(episode) {
                if (episode["imdbRating"] !== "N/A") {
                    //get episode data
                    var epNum = parseInt(episode["Episode"]);
                    var rating = parseFloat(episode["imdbRating"]);
                    var showTitle = episode["Title"];
                    var season = parseInt(seasonNumber);
                    //fill the d3 dataset variables
                    if (epNum == 1) {
                        firstEpisodes.push(epId);
                        xAxisLabels.push("Season " + season);
                    }
                    episodedataset.push([epId, rating]);
                    ratingdataset.push(rating);
                    infoset.push([showTitle, rating, season, epNum]);
                    seasonAvg.push([season, rating]);
                    epId++;
                }
            })
        }
    }

    var seasonScore = [];

    //This reveals data when you mouse over nodes.
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Title:</strong> <span style='color:#2FFF4D'>" + d[0] + "</span>" + "<br>" + "<strong>Rating:</strong> <span style='color:#2FFF4D'>" + d[1] + "</span>" + "<br>" + "<strong>Season:</strong> <span style='color:#2FFF4D'>" + d[2] + "</span>" + "<br>" + "<strong>Episode:</strong> <span style='color:#2FFF4D'>" + d[3] + "</span>";
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
        .domain([0, d3.max(episodedataset, function(d) {
            return d[0];
        })])
        .range([boardSettings.getXMin(), boardSettings.getXMax()]);

    /*y scale*/ //based on rating data set
    ratingdataset.sort();
    var yScale = d3.scale.linear()
        .domain([ratingdataset[0] - 0.2, ratingdataset[ratingdataset.length - 1] + 0.1])
        .range([boardSettings.getYMin(), boardSettings.getYMax()]);

    /*x axis*/
    firstEpisodes = firstEpisodes.map(function(episodeNum) {
        return xScale(episodeNum);
    })
    firstEpisodes.unshift(boardSettings.getXMin());
    firstEpisodes.push(boardSettings.getXMax());
    xAxisLabels.unshift("");
    xAxisLabels.push("");

    var xAxisScale = d3.scale.ordinal()
        .domain(xAxisLabels)
        .range(firstEpisodes);

    var xAxis = d3.svg.axis()
        .scale(xAxisScale)
        .orient('bottom');

    /*append x axis*/
    svg.append('g')
        .attr({
            'class': 'xaxis',
            'transform': 'translate(0,' + boardSettings.getYMin() + ')'
        })
        .call(xAxis)
        .append("text")
        .attr("y", -12)
        .attr("x", boardSettings.width - 35)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Episode");

    /*y axis*/
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    /*append y axis*/
    svg.append('g')
        .attr({
            'class': 'yaxis',
            'transform': 'translate(' + boardSettings.getXMin() + ',0)'
        })
        .call(yAxis)
        .append("text")
        .attr("y", 5)
        .attr("x", 40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("IMDB Rating");

    /*add points*/
    var points = svg.selectAll('circle')
        .data(episodedataset)
        .enter()
        .append('circle');

    function scaleDuration(datasetLength) {
        return (1/datasetLength) * 1000;
    }
    function getPointsRadius() {
        var widthPerPoint = boardSettings.width/episodedataset.length;
        if (widthPerPoint < 2) {
            return 2;
        } else if (widthPerPoint > 10) {
            return 10;
        } else {
            return widthPerPoint;
        }
    }
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
                return xScale(d[0]);
            },
            'cy': function(d) {
                return yScale(d[1]);
            },
            'r': getPointsRadius(),
            'class': 'datapoint',
            'id': function(d, i) {
                return i;
            }
        })
        .style('opacity', 1);

    d3.select('#graph svg')
        .append("text")
        .attr("x", boardSettings.width / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .style("fill", "#2FFF4D")
        .text(showName);

    svg.selectAll('circle').data(infoset).on('mouseover', tip.show).on('mouseout', tip.hide);

    var trendLine = function() {
        var x1 = 0;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        var len = episodedataset.length;

        episodedataset.forEach(function(dataSet){
            x1 += dataSet[0];
            y1 += dataSet[1];
            x2 += (dataSet[0] * dataSet[1]);
            y2 += (dataSet[0] * dataSet[0]);
        })

        var slope = (((len * x2) - (x1 * y1)) / ((len * y2) - (x1 * x1)))
        var intercept = ((y1 - (slope * x1)) / len)
        var xLabels = episodedataset.map(function(d) {
            return d[0];
        });
        var xSeries = d3.range(1, xLabels.length + 1);
        var ySeries = episodedataset.map(function(d) {
            return d[1];
        });
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
            .style("stroke", "rgb(47,255,77)")
    };
    //d3.select('#graph svg').text('');
    if (data_url["Title"] !== undefined) {
        trendLine();
    }
};

