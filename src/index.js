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

function initControls() {
  document.getElementById('previous-pnl-btn').addEventListener('mousedown', () => {
    if (currentPanel === 0) return;
    currentPanel--;
    const pnl = storyPanels[currentPanel];
    map.loadArcs(pnl.minYear, pnl.maxYear, pnl.countries);
    setTitle(pnl.title);
  });
  document.getElementById('next-pnl-btn').addEventListener('mousedown', () => {
    if (currentPanel === storyPanels.length - 1) return;
    currentPanel++;
    const pnl = storyPanels[currentPanel];
    map.loadArcs(pnl.minYear, pnl.maxYear, pnl.countries);
    setTitle(pnl.title);
  });
}

function setTitle(title) {
  document.getElementById('pnl-title').innerText = title;
}

window.addEventListener('load', () => {
  const pnl = storyPanels[currentPanel];
  map = new DataVizMap();
  map.loadArcs(pnl.minYear, pnl.maxYear, pnl.countries);
  initControls();
  setTitle(storyPanels[0].title);
});
window.addEventListener('resize', () => {
  map.resize();
});