import Datamap from 'datamaps';
import COLORS from './colors';
import * as d3Geo from 'd3-geo';
import * as d3 from 'd3';
import { normalizeCountryName } from './utilities';
import countries from '../data/countries.json';

export default class DataVizMap {
  constructor() {
    this.datamap = new Datamap({
      element: document.getElementById('map-container'),
      responsive: true,
      setProjection: (element) => {
          let projection = d3Geo.geoMercator()
            .translate([element.offsetWidth / 2, element.offsetHeight / 1.9])
            .scale(210);
          let path = d3Geo.geoPath(projection);
        return { path, projection };
      },
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
          return `<div class="hoverinfo"><strong>
            ${normalizeCountryName(countries, geography.id, geography.properties.name)}
          </strong></div>`;
        }
      }
    });
  }

  resize() {
    this.datamap.resize();
  }

  loadArcs(groupedDataArr, numYears, focusCountries, hovering) {
    d3.selectAll(`.datamap .datamaps-subunit`).style("fill", COLORS.WHITE);
    let arcs = groupedDataArr.map(data => {
      const c = data.count / numYears;
      const idx = focusCountries.indexOf(data.origin);    
      d3.select(`.datamap .${data.origin}`)
        .style("fill", idx == 0 ? (hovering ? 'rgba(121,94,153, 0.5)' : 'rgba(153,68,0,0.8)') : 'rgba(169, 120, 120, 0.5)');
      return {
        origin: {
          latitude: countries[data.origin].latitude,
          longitude: countries[data.origin].longitude
        },
        destination: {
          latitude: countries[data.destination].latitude,
          longitude: countries[data.destination].longitude
        },
        originCode: data.origin,
        options: {
          strokeWidth: c > 160000 ? 4
            : c > 80000 ? 3.5
            : c > 40000 ? 3 
            : c > 20000 ? 2.5 
            : c > 10000 ? 2 
            : c > 5000 ? 1.5 
            : c > 2500 ? 1 
            : 0.5,
          strokeColor: idx == 0 ? (hovering ? 'rgba(121,94,153, 1)' : COLORS.RED) : 'rgba(169, 120, 120, 0.5)',
          animationSpeed: 2200
        }
      }
    });
    this.datamap.arc(arcs);
    
    //console.log(groupedDataArr.filter(d => d.origin === focusCountries[0]));
  }

}