import 'core-js';
import DataVizMap from './dataVizMap';
import DataVizBar from './dataVizBar';
import DataVizPicto from './dataVizPicto';
import refugees from '../data/refugees';
import * as d3 from 'd3';

let map = null;
let bar = null;
let picto = null;
let currentPanel = 0;
let hoverBar = false;

class StoryPanel {
  constructor(title, minYear, maxYear, countries) {
    this.title = title;
    this.minYear = minYear;
    this.maxYear = maxYear;
    this.countries = countries;
  }
}

const storyPanels = [
  new StoryPanel('Post Vietnam War (1975-1995)', 1975, 1995, ['VNM']),
  new StoryPanel('Iran-Iraq War (1980-1988)', 1980, 1988, ['IRQ']),
  new StoryPanel('Civil War in Mozambique (1977-1992)', 1977, 1992, ['MOZ']),
  new StoryPanel('Rwandan Genocide (1994)', 1993, 1996, ['RWA']),
  new StoryPanel('Breakup of Yugoslavia (1994-1995)', 1994, 1995, ['BIH']),
  new StoryPanel('Iraq War (2003-2011)', 2003, 2011, ['IRQ']),
  new StoryPanel('War in Syria (2011-ongoing)', 2011, 2016, ['SYR']),
  new StoryPanel('South Sudanese Civil War (2013-ongoing)', 2013, 2016, ['SSD']),
  new StoryPanel('Top Areas of Displacement 1975-2016', 1975, 2016, []),
];

function getPanelData(yearMin, yearMax) {
  const originCounter = {};
  const invalidCountryCodes = ['XXY'];
  const numberToLoad = 10;
  let grandTotal = 0;
  const filteredData = refugees.filter(r => r[2] >= yearMin && r[2] <= yearMax)
    .map(r => {
      const data = {
        destination: r[0],
        origin: r[1],
        year: r[2],
        count: r[3]
      };
      if (originCounter[data.origin]) {
        originCounter[data.origin].value += data.count;
      } else {
        originCounter[data.origin] = {
          key: data.origin,
          value: data.count
        };
      }
      grandTotal += data.count;
      return data;
    });

  let sortedCountries = Object.keys(originCounter).map(key => originCounter[key]).sort((a, b) => b.value - a.value);
  let topCountryCodes = sortedCountries
    .filter(c => invalidCountryCodes.indexOf(c.key) === -1)
    .slice(0, numberToLoad)
    .map(c => c.key);
  let topCountryData = filteredData
    .filter(data => topCountryCodes.indexOf(data.origin) > -1 && data.count > 1000);

  // Total data across years by destination
  let groupedData = {};
  let totals = {};
  for (let i = 0; i < topCountryData.length; i++) {
    const dataPoint = topCountryData[i];
    const key = `${dataPoint.origin}${dataPoint.destination}`;
    if (groupedData[key]) {
      groupedData[key].count += dataPoint.count;
    } else {
      groupedData[key] = dataPoint;
    }
    if (totals[dataPoint.origin]) {
      totals[dataPoint.origin] += dataPoint.count;
    } else {
      totals[dataPoint.origin] = dataPoint.count;
    }
  }

  const groupedDataArr = Object.keys(groupedData).map(key => groupedData[key]);
  return { groupedDataArr, totals, grandTotal };
}

function loadPanel(minYear, maxYear, countries) {
  const numYears = maxYear - minYear + 1;
  const { groupedDataArr, totals, grandTotal } = getPanelData(minYear, maxYear);
  map.loadArcs(groupedDataArr, numYears, countries);
  bar.loadBars(groupedDataArr, numYears, countries, totals, map);
  picto.loadPicto(countries[0], totals, numYears);
}

function initControls() {
  document.getElementById('previous-pnl-btn').addEventListener('mousedown', () => {
    if (currentPanel === 0) return;
    currentPanel--;
    if (currentPanel === 0) d3.select('#previous-pnl-btn').style('opacity', '0.3');
    d3.select('#next-pnl-btn').style('opacity', '1');
    const pnl = storyPanels[currentPanel];
    loadPanel(pnl.minYear, pnl.maxYear, pnl.countries)
    setTitle(pnl.minYear, pnl.maxYear, pnl.title);
  });
  document.getElementById('next-pnl-btn').addEventListener('mousedown', () => {
    if (currentPanel === storyPanels.length - 1) return;
    currentPanel++;
    if (currentPanel === storyPanels.length - 1) d3.select('#next-pnl-btn').style('opacity', '0.3');
    d3.select('#previous-pnl-btn').style('opacity', '1');
    const pnl = storyPanels[currentPanel];
    loadPanel(pnl.minYear, pnl.maxYear, pnl.countries);
    setTitle(pnl.minYear, pnl.maxYear, pnl.title);
  });
  document.getElementById('info-btn').addEventListener('mousedown', () => {
    d3.select('#about-sources').style('display', 'block');
  });
  document.getElementById('close-info-btn').addEventListener('mousedown', () => {
    d3.select('#about-sources').style('display', 'none');
  });
}

function setTitle(minYear, maxYear, title) {
  var numYears = maxYear - minYear + 1;
  document.getElementById('pnl-title').innerText = title;
  document.getElementById('bar-title-year').innerText = minYear !== maxYear ? `${minYear}-${maxYear}`: minYear;
  document.getElementById('bar-title-length').innerText = ` (over ${numYears} year${numYears > 1 ? 's' : ''})`;
}

window.addEventListener('load', () => {
  const pnl = storyPanels[currentPanel];
  map = new DataVizMap();
  bar = new DataVizBar();
  picto = new DataVizPicto();
  initControls();
  loadPanel(pnl.minYear, pnl.maxYear, pnl.countries)
  setTitle(pnl.minYear, pnl.maxYear, storyPanels[0].title);
  d3.select('#previous-pnl-btn').style('opacity', '0.3');
});
window.addEventListener('resize', () => {
  map.resize();
});

window.addEventListener("mousemove", (e) => {
  var bars = document.querySelectorAll('#barchart-container .bar');
  var anyHover = false;
  // Any hovering
  for (let i = 0; i < bars.length; i++) {
    var boundingBox = bars[i].getBoundingClientRect();
    if (e.clientX > boundingBox.left && e.clientX < boundingBox.right && e.clientY > boundingBox.top && e.clientY < boundingBox.bottom) {
      anyHover = true;
      if (!hoverBar){
        d3.select('#barchart-container').style("z-index", 1);
        d3.select('#map-container').style("z-index", 0);
      }
      break;
    }
  }
  // Not hovering
  if (!anyHover) {
    if (hoverBar) {
      d3.select('#barchart-container').style("z-index", 0);
      d3.select('#map-container').style("z-index", 1);
    }
  }
  hoverBar = anyHover;
});