import * as d3 from 'd3';
import { normalizeCountryName } from './utilities';
import countries from '../data/countries.json';

export default class DataVizBar {
  constructor() {
    this.tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip");
  }

  loadBars(groupedDataArr, numYears, focuscountries, totals, map) {
    var data = Object.keys(totals).map(code => ({ name: code, value: totals[code] }));

    var svg = d3.select("#barchart-container");
    svg.selectAll('*').remove();
    var margin = { top: 10, right: 0, bottom: 20, left: 40 };
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().range([width, 0]);
    var y = d3.scaleLinear().range([0, height]);

    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.sort(function (a, b) { return a.value - b.value; });

    var maxVal = d3.max(data, d => Math.ceil(d.value/5000000)*5000000);
    var maxTick = maxVal < 75000000 ? 75000000 : maxVal;

    y.domain([maxTick, 0]);
    x.domain(data.map(d => d.name)).padding(0.1);

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(1));

    g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).tickValues(d3.range(0, maxTick * 1.2, maxTick / 5)).tickFormat(d => parseInt(d / 1000000) + 'M'));

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", d => `bar ${focuscountries.indexOf(d.name) === 0 ? 'focus-bar' : ''} ${d.name}`)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("x", d => x(d.name))
      .attr("height", d => height - y(d.value))
      .on("mousemove", d => { 
        this.tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 80 + "px")
              .style("display", "inline-block")
              .html(`<strong>${normalizeCountryName(countries, d.name)}</strong>
                <br>${Math.round(d.value * 10 / 1000000 ) / 10} million refugees`);
              map.loadArcs(groupedDataArr, numYears, [d.name], true);
              if (focuscountries.indexOf(d.name) !== 0)
                d3.select(`.bar.focus-bar`).style("fill", "rgba(169, 120, 120, 0.8)");
      })
      .on("mouseout", d => {
        this.tooltip.style("display", "none");
        map.loadArcs(groupedDataArr, numYears, focuscountries);
        d3.select(`.bar.focus-bar`).style("fill", "#994400");
       });
  }
}