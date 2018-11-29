import 'core-js';
import DataVizMap from './dataVizMap';

let map = null;
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
  new StoryPanel('Somali Invasion of Ethiopia', 1977, 1979, ['ETH']),
  new StoryPanel('Civil War in Mozambique', 1976, 1992, ['MOZ']),
  new StoryPanel('Soviet Invasion of Afghanistan', 1979, 1979, ['AFG']),
  new StoryPanel('Rwandan Genocide', 1993, 1996, ['RWA']),
  new StoryPanel('SYR', 2016, 2016, ['SYR']),
];

function initControls() {
  const testBtn = document.getElementById('test');
  testBtn.addEventListener('mousedown', () => {
    currentPanel++;
    const pnl = storyPanels[currentPanel];
    map.loadArcs(pnl.minYear, pnl.maxYear, pnl.countries);
  });
}

window.addEventListener('load', () => {
  const pnl = storyPanels[currentPanel];
  map = new DataVizMap();
  map.loadArcs(pnl.minYear, pnl.maxYear, pnl.countries);
  initControls();
});
window.addEventListener('resize', () => {
  map.resize();
});