import { normalizeCountryName } from './utilities';
import countries from '../data/countries.json';

export default class DataVizPicto {
  constructor() {

  }



  loadPicto(country, totals, numYears) {
    const torontoPopulation = 2.732; // million
    const refugees = totals[country];
    const asMil = (val) => Math.round(val * 10 / 1000000) / 10;
    const times = Math.round((asMil(refugees) / torontoPopulation) * 10) / 10;
    document.getElementById('picto-container-text').innerHTML =
      times ? "Over <span class='bold'>" + numYears + " years</span>, <span class='red bold'>" + asMil(refugees) + 
        " million</span> refugees were displaced from <span class='red bold'>" +
        normalizeCountryName(countries, country) + "</span>.<br/>That's approximately <span class='bold'>" + times +
        " times</span> the current population of Toronto." : "";

    const icons = document.getElementById('picto-container-icons');
    icons.innerHTML = "";

    for (let i = 0; i < parseInt(times); i++) {
      var div = document.createElement("div");
      div.className = "icon-div";
      var img = document.createElement("img");
      img.src = "assets/toronto.svg";
      div.appendChild(img);
      icons.appendChild(div);
    }

    if (times != parseInt(times)) {
      var fractional = times - parseInt(times);
      var div = document.createElement("div");
      div.className = "icon-div";
      div.style.width = (fractional * 50) - 5 + 'px';
      var img = document.createElement("img");
      img.src = "assets/toronto.svg";
      div.appendChild(img);
      icons.appendChild(div);

      if (!times) {
        div.style.visibility = "hidden";
        return;
      }
      
      var gdiv = document.createElement("div");
      gdiv.className = "icon-div grey";
      gdiv.style.width = (((1 - fractional) * 50) - 5) + 'px';
      var gimg = document.createElement("img");
      gimg.src = "assets/torontogrey.svg";
      gdiv.appendChild(gimg);
      icons.appendChild(gdiv);
    }
  }
}