import { initSearchModal } from './components/search-modal.js';
import { initSliders } from './components/sliders.js';
import { initTabs } from './components/tabs.js';

function initApp() {
    initTabs();
    initSliders();
    initSearchModal();
}

initApp();
