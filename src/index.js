import 'core-js';
import DataVizMap from './dataVizMap';
import BarChart from './dataVizBar';
import refugees from '../data/refugees';

let map = null;
let bar = null;
let currentPanel = 0;

class StoryPanel {
  constructor(title, minYear, maxYear, countries) {
    this.title = title;
    this.minYear = minYear;
    this.maxYear = maxYear;
    this.countries = countries;
  }
}

const storyPanels = [
  new StoryPanel('Vietnam War (1975-1995)', 1975, 1995, ['VNM']),
  new StoryPanel('Iran-Iraq War (1980-1988)', 1980, 1988, ['IRQ']),
  new StoryPanel('Somali Invasion of Ethiopia (1977-1979)', 1977, 1979, ['ETH']),
  new StoryPanel('Civil War in Mozambique (1976-1992)', 1976, 1992, ['MOZ']),
  new StoryPanel('Soviet Invasion of Afghanistan (1979)', 1979, 1979, ['AFG']),
  new StoryPanel('Iraqi Suppression of rebel movement (1991)', 1991, 1991, ['IRQ']),
  new StoryPanel('Rwandan Genocide (1994)', 1993, 1996, ['RWA']),
  new StoryPanel('Breakup of Yugoslavia (1994-1995)', 1994, 1995, ['BIH']),
  new StoryPanel('US Invasion of Iraq & Subsquent Civil War (2003-2016+)', 2003, 2016, ['SYR']),
  new StoryPanel('War in Syria (2011-2016+)', 2011, 2016, ['SYR']),
  new StoryPanel('South Sudanese Civil War (2013-2015)', 2013, 2015, ['SSD']),
  new StoryPanel('Top Sources of Refugees 1975-2016', 1975, 2016, []),
];

function getPanelData(yearMin, yearMax) {
  const originCounter = {};
  const invalidCountryCodes = ['XXY'];
  const numberToLoad = 10;

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
  return { groupedDataArr, totals };
}

function loadPanel(minYear, maxYear, countries) {
  const numYears = maxYear - minYear + 1;
  const { groupedDataArr, totals } = getPanelData(minYear, maxYear);
  map.loadArcs(groupedDataArr, numYears, countries);
  bar.loadBars(groupedDataArr, numYears, countries, totals);

  //console.log(countries[0], total[countries[0]].toLocaleString());
}

function initControls() {
  document.getElementById('previous-pnl-btn').addEventListener('mousedown', () => {
    if (currentPanel === 0) return;
    currentPanel--;
    const pnl = storyPanels[currentPanel];
    loadPanel(pnl.minYear, pnl.maxYear, pnl.countries)
    setTitle(pnl.title);
  });
  document.getElementById('next-pnl-btn').addEventListener('mousedown', () => {
    if (currentPanel === storyPanels.length - 1) return;
    currentPanel++;
    const pnl = storyPanels[currentPanel];
    loadPanel(pnl.minYear, pnl.maxYear, pnl.countries);
    setTitle(pnl.title);
  });
}

function setTitle(title) {
  document.getElementById('pnl-title').innerText = title;
}

window.addEventListener('load', () => {
  const pnl = storyPanels[currentPanel];
  map = new DataVizMap();
  bar = new BarChart();
  initControls();
  loadPanel(pnl.minYear, pnl.maxYear, pnl.countries)
  setTitle(storyPanels[0].title);
});
window.addEventListener('resize', () => {
  map.resize();
});