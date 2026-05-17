import { qs, qsa } from '../utils/dom.js';

function activateTab(tabGroup, target) {
    const buttons = qsa('.tab-btn[data-tab-target]', tabGroup);
    const panels = qsa('.tab-panel[data-tab-panel]', tabGroup);

    buttons.forEach((button) => {
        const isActive = button.dataset.tabTarget === target;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
        const isActive = panel.dataset.tabPanel === target;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;

        if (isActive) {
            const grid = qs('.slider-grid', panel);
            grid?.scrollTo({ left: 0 });
            grid?.dispatchEvent(new Event('slider:refresh'));
        }
    });

    qs('.games-slider-section', tabGroup)?.dispatchEvent(new Event('tab:change'));
}

export function initTabs() {
    qsa('.js-tabbed-slider').forEach((tabGroup) => {
        const buttons = qsa('.tab-btn[data-tab-target]', tabGroup);
        const panels = qsa('.tab-panel[data-tab-panel]', tabGroup);

        if (buttons.length === 0 || panels.length === 0) return;

        buttons.forEach((button) => {
            button.type = 'button';
            button.addEventListener('click', () => activateTab(tabGroup, button.dataset.tabTarget));
        });

        const activeButton = qs('.tab-btn.active[data-tab-target]', tabGroup) || buttons[0];
        activateTab(tabGroup, activeButton.dataset.tabTarget);
    });
}
