import React, { Component } from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
// import tip from 'd3-tip';
import _ from 'lodash';

//d3.tip = tip;

class LineGraph extends Component{

  componentDidUpdate() {
    this.updateChart(this.props.lineData);
  }

  updateChart(lineData){
    const margin = {top: 30, right: 20, bottom: 30, left: 50};
    const w = 500 - margin.left - margin.right;
    const h = 300 - margin.top - margin.bottom;
    const data = lineData;

    const dates = _.map(data, 'date');
    const counts = _.map(data, 'count');

    /* Initialize tooltip */
    // let tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .html((d) => d);

    /* Initialize tooltip */
    // const tip = d3.tip()
    //   .attr('class', 'd3-tip')
    //   .offset([-10, 0])
    //   .html(function(d) {
    //     return "<strong>Overdue:</strong> <span>" + d.count + "</span>";
    //   });

    const x = d3.scale.ordinal()
      .rangePoints([0, w]);

    const y = d3.scale.linear()
      .range([h, 0]);

    const xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5);


    const yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    const line = d3.svg.line()
      .interpolate('linear')
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.count);
      });

    d3.select("#chart").select("svg").remove();

    let svg = d3
      .select('#chart')
      .append('svg')
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append('g')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.call(tip);

      // Scale the range of the data
    x.domain(dates);
    y.domain([0, d3.max(counts)]);

    let path = svg.append("path")
      .attr("d", line(data));

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

        // Add the scatterplot
    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.count); });
      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);

    svg.append("g")         // Add the X Axis
        .attr("class", "axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    svg.append("g")         // Add the Y Axis
      .attr("class", "axis")
      .call(yAxis);

  }


  render(){
    return <div id="chart"></div>;
  }
}

export default connect( state => ({ lineData: state.main.lineData }))(LineGraph);
