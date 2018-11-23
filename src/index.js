import 'core-js';
import DataVizMap from './dataVizMap';

let map = null;

function initControls() {
  document.getElementById('test');
}

window.addEventListener('load', () => {
  map = new DataVizMap();
  map.loadArcs(1977, 1992);
  initControls();
});
window.addEventListener('resize', () => {
  map.resize();
});