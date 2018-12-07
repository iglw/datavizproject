import * as d3 from 'd3';

export default class DataVizBar {
  constructor() {

  }

  loadBars(groupedDataArr, numYears, focusCountries, totals) {
    var data = Object.keys(totals).map(code => ({ name: code, value: totals[code] }));
    debugger;

    var svg = d3.select("#barchart-container");
    svg.selectAll('*').remove();
    var margin = { top: 20, right: 20, bottom: 20, left: 40 };
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    // var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);

    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.sort(function (a, b) { return a.value - b.value; });

    x.domain([0, d3.max(data, function (d) { return d.value; })]);
    y.domain(data.map(d => d.name)).padding(0.1);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(1));

    g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(0));

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", d => `bar ${focusCountries.indexOf(d.name) === 0 ? 'focus-bar' : ''}`)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", d => y(d.name))
      .attr("width", d => x(d.value))
      .on("mousemove", d => { })
      .on("mouseout", d => { });
  }
}