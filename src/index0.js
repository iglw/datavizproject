// import 'core-js';
// import Datamap from 'datamaps';
// import countries from '../data/countries.json';
// import refugees from '../data/refugees.json';

// const DataVizMap = {
//   map: null,
//   arcs: [],
//   data: null
// };

// const standardizedCountryName = (iso3Code, datamapName) => countries[iso3Code] ? countries[iso3Code].gName : datamapName;

// const initMap = () => {
//   DataVizMap.map = new Datamap({
//     element: document.getElementById('container'),
//     responsive: true,
//     projection: 'mercator',
//     // fills: {
//     //   red: '#990000'
//     // },
//     geographyConfig: {
//       highlightFillColor: '#2C2C2C',
//       highlightBorderColor: '#FFFFFF',
//       popupTemplate: (geography, data) => {
//         return '<div class="hoverinfo"><strong>' +
//           standardizedCountryName(geography.id, geography.properties.name) +
//           '</strong></div>';
//       }
//     },
//     data: {

//     }
//   });
//   window.addEventListener('resize', () => {
//     DataVizMap.map.resize();
//   });
// }

// const colors = [
//   '#a6cee3',
//   '#1f78b4',
//   '#b2df8a',
//   '#33a02c',
//   '#fb9a99',
//   '#e31a1c',
//   '#fdbf6f',
//   '#ff7f00',
//   '#cab2d6',
//   '#6a3d9a'
// ];

// const loadData = () => {
//   let originCounter = { };
//   const filteredData = refugees.filter(r => r[2] === 1975 && r[3] > 5000).map(r => {
//     const data = {
//       destination: r[0],
//       origin: r[1],
//       year: r[2],
//       count: r[3]
//     };
//     if (originCounter[data.origin]) {
//       originCounter[data.origin].value += data.count;
//     } else {
//       originCounter[data.origin] = { key: data.origin, value: data.count };
//     }
//     return data;
//   });

//   let sortedCountries = Object.keys(originCounter).map(key => originCounter[key]).sort((a, b) => b.value - a.value);
//   let topTen = sortedCountries.slice(0, 5).map(c => c.key);

//   const topTenData = filteredData.filter(data => topTen.indexOf(data.origin) > -1);
  
//   let countryColors = {};

//   for (let i = 0; i < topTenData.length; i++) {
//     let data = topTenData[i];
//     countryColors[data.origin] = {colors[topTen.indexOf(data.origin)]};
//   }

//   DataVizMap.arcs = topTenData.map(data => ({
//     origin: data.origin,
//     destination: data.destination,
//     options: {
//       strokeWidth: 1,
//       strokeColor: colors[topTen.indexOf(data.origin)],
//       //strokeColor: '#990000',
//       greatArc: true,
//       animationSpeed: 3000
//     }
//   }));
//   DataVizMap.geo = {
//       countryColors
//   }

// }

// const drawArcs = () => {
//   DataVizMap.map.arc(DataVizMap.arcs);
// }

// window.addEventListener('load', () => {
//   loadData();
//   initMap();
//   drawArcs();
//   //addBubbles();
// });