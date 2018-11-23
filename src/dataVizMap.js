import Datamap from 'datamaps';
import COLORS from './colors';
import { normalizeCountryName } from './utilities';
import countries from '../data/countries.json';
import refugees from '../data/refugees';

export default class DataVizMap {
  constructor() {
    this.datamap = new Datamap({
      element: document.getElementById('container'),
      responsive: true,
      projection: 'mercator',
      fills: {
        defaultFill: COLORS.BLACK
      },
      geographyConfig: {
        highlightFillColor: COLORS.DARKGREY,
        highlightBorderColor: COLORS.WHITE,
        popupTemplate: (geography, data) => {
          return `<div class="hoverinfo"><strong>${normalizeCountryName(countries, geography.id, geography.properties.name)}</strong></div>`;
        }
      }
    });
  }

  resize() {
    this.datamap.resize();
  }

  loadArcs(yearMin, yearMax) {
    const originCounter = {};
    const invalidCountryCodes = ['XXY', 'AFG'];
    const numberToLoad = 20;

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
      .filter(data => topCountryCodes.indexOf(data.origin) > -1 && data.count > 10);

    let arcs = topCountryData.map(data => ({
      origin: data.origin,
      destination: data.destination,
      options: {
        strokeWidth: 1,
        strokeColor: topCountryCodes.indexOf(data.origin) === 0 ? COLORS.RED : 'rgba(99, 30, 30, 0.20)',
        animationSpeed: 3000
      }
    }));
    debugger;
    this.datamap.arc(arcs);
  }

}