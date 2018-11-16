import 'core-js';
//import * as d3 from 'd3';
import Datamap from 'datamaps';
import countries from '../data/countries.json';

const DataVizMap = {
  map: null
};

const standardizedCountryName = (iso3Code, datamapName) => {
  if (countries[iso3Code]) {
    return countries[iso3Code].gName; // Return Google name
  } else {
    return iso3Code;
  }
}

const initMap = () => {
  DataVizMap.map = new Datamap({
    element: document.getElementById('container'),
    responsive: true,
    projection: 'mercator',
    fills: {
      red: '#990000'
    },
    geographyConfig: {
      highlightFillColor: '#2C2C2C',
      highlightBorderColor: '#FFFFFF',
      popupTemplate: (geography, data) => {
        return '<div class="hoverinfo"><strong>' + 
          standardizedCountryName(geography.id, geography.properties.name) + 
          '</strong></div>';
      }
    }
  });
  window.addEventListener('resize', () => {
    DataVizMap.map.resize();
  });
}

const addBubbles = () => {
  let countriesToRender = Object.keys(countries).map(countryCode => {
    const country = countries[countryCode];
    return {
      radius: 2,
      fillOpacity: 1,
      borderWidth: 0,
      highlightFillOpacity: 1,
      name: country.gName,
      latitude: country.latitude,
      longitude: country.longitude,
      fillKey: 'red',
      highlightFillColor: '#990000',
      data: country
    };
  });
  DataVizMap.map.bubbles(countriesToRender, { popupOnHover: false });
}

const addArcs = () => {
  // DataVizMap.map.arc([
  //   {
  //     origin: {
  //       latitude: 61,
  //       longitude: -149
  //     },
  //     destination: {
  //       latitude: -22,
  //       longitude: -43
  //     },
  //     options: {
  //       strokeWidth: 10,
  //       strokeColor: 'rgba(150, 00, 00, 1)',
  //       greatarc: true
  //     },
  //     data: 'hello, this is custom data'
  //   }],
  //   {
  //     greatarc: true,
  //     animationSpeed: 1200
  //   });
}

window.addEventListener('load', () => {
  initMap();
  addArcs();
  //addBubbles();
});