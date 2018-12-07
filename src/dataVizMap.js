import Datamap from 'datamaps';
import COLORS from './colors';
import * as d3Geo from 'd3-geo';
import { normalizeCountryName } from './utilities';
import countries from '../data/countries.json';
import refugees from '../data/refugees';

export default class DataVizMap {
  constructor() {
    this.datamap = new Datamap({
      element: document.getElementById('container'),
      responsive: true,
      setProjection: (element) => {
        // let projection = d3Geo.geoTransverseMercator()
        //   .center([23, -3])
        //   .rotate([4.4, 0])
        //   .scale(400)
        //   .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
          let projection = d3Geo.geoMercator()
            .translate([element.offsetWidth / 2, element.offsetHeight / 1.9])
            .scale(210);
          let path = d3Geo.geoPath(projection);
        return { path, projection };
      },
      //projection: 'mercator',
      fills: {
        defaultFill: COLORS.WHITE
      },
      geographyConfig: {
        highlightFillColor: COLORS.LIGHTGREY,
        highlightBorderColor: COLORS.DARKGREY,
        highlightBorderWidth: 1,
        borderColor: COLORS.DARKGREY,
        borderWidth: 1,
        popupTemplate: (geography, data) => {
          return `<div class="hoverinfo"><strong>${normalizeCountryName(countries, geography.id, geography.properties.name)}</strong></div>`;
        }
      }
    });
  }

  resize() {
    this.datamap.resize();
  }

  loadArcs(yearMin, yearMax, focusCountries) {
    const originCounter = {};
    const invalidCountryCodes = ['XXY'];
    const numberToLoad = 10;
    const numYears = yearMax - yearMin + 1;

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
    let total = {};
    for (let i = 0; i < topCountryData.length; i++) {
      const dataPoint = topCountryData[i];
      const key = `${dataPoint.origin}${dataPoint.destination}`;
      if (groupedData[key]) {
        groupedData[key].count += dataPoint.count;
      } else {
        groupedData[key] = dataPoint;
      }
      if (total[dataPoint.origin]) {
        total[dataPoint.origin] += dataPoint.count;
      } else {
        total[dataPoint.origin] = dataPoint.count;
      }
    }

    const groupedDataArr = Object.keys(groupedData).map(key => groupedData[key]);
    let arcs = groupedDataArr.map(data => {
      const c = data.count / numYears;
      const idx = focusCountries 
        ? focusCountries.indexOf(data.origin)
        : topCountryCodes.indexOf(data.origin);
      //const strokeColor = (opacity) => `rgba(119, 70, 70, ${opacity})`;
      const strokeColor = (opacity) => `rgba(169, 120, 120, ${opacity})`;
      return {
        origin: {
          latitude: countries[data.origin].latitude,
          longitude: countries[data.origin].longitude
        },
        destination: {
          latitude: countries[data.destination].latitude,
          longitude: countries[data.destination].longitude
        },
        options: {
          strokeWidth: c > 160000 ? 4
            : c > 80000 ? 3.5
            : c > 40000 ? 3 
            : c > 20000 ? 2.5 
            : c > 10000 ? 2 
            : c > 5000 ? 1.5 
            : c > 2500 ? 1 
            : 0.5,
          strokeColor: idx == 0 ? COLORS.RED
            // : idx < 11 ? strokeColor(0.4)
            // : idx < 21 ? strokeColor(0.4)
              : strokeColor(0.6),
          animationSpeed: 2200
        }
      }
    });
    this.datamap.arc(arcs);
    
    //console.log(groupedDataArr.filter(d => d.origin === focusCountries[0]));
    console.log(focusCountries[0], total[focusCountries[0]].toLocaleString());
  }

}