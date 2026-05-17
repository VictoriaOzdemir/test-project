import { qs, qsa } from '../utils/dom.js';

const DRAG_START_THRESHOLD = 4;
const CLICK_SUPPRESS_DISTANCE = 8;

function visibleItems(container) {
    return Array.from(container.children).filter((item) => item.offsetParent !== null);
}

function scrollDistance(container) {
    const items = visibleItems(container);

    if (items.length > 1) {
        return items[1].offsetLeft - items[0].offsetLeft;
    }

    if (items.length === 1) {
        return items[0].getBoundingClientRect().width;
    }

    return container.clientWidth;
}

function activeSliderGrid(section) {
    return qs('.tab-panel.active .slider-grid', section) || qs('.slider-grid', section);
}

function initDragScroll(container) {
    if (!container || container.dataset.dragReady === 'true') return;

    container.dataset.dragReady = 'true';

    let pointerId = null;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let startScrollLeft = 0;
    let suppressClick = false;

    const stop = (event) => {
        if (pointerId !== null && event?.pointerId !== pointerId) return;

        if (pointerId !== null && container.hasPointerCapture?.(pointerId)) {
            container.releasePointerCapture(pointerId);
        }

        pointerId = null;
        isDragging = false;
        container.classList.remove('active');
        container.classList.remove('is-dragging');
        container.style.removeProperty('scroll-snap-type');
    };

    const start = (event) => {
        if (event.button !== undefined && event.button !== 0) return;

        pointerId = event.pointerId;
        isDragging = false;
        suppressClick = false;
        container.classList.add('active');
        container.setPointerCapture?.(pointerId);

        startX = event.clientX;
        lastX = startX;
        startScrollLeft = container.scrollLeft;
    };

    const move = (event) => {
        if (pointerId !== event.pointerId) return;

        const distance = event.clientX - startX;

        if (!isDragging && Math.abs(distance) < DRAG_START_THRESHOLD) {
            return;
        }

        if (!isDragging) {
            isDragging = true;
            container.classList.add('is-dragging');
            container.style.scrollSnapType = 'none';
        }

        if (event.cancelable) {
            event.preventDefault();
        }

        container.scrollLeft = startScrollLeft - distance;
        lastX = event.clientX;

        if (Math.abs(lastX - startX) > CLICK_SUPPRESS_DISTANCE) {
            suppressClick = true;
        }
    };

    container.addEventListener('pointerdown', start);
    container.addEventListener('pointermove', move);
    container.addEventListener('pointerup', stop);
    container.addEventListener('pointercancel', stop);
    container.addEventListener('lostpointercapture', stop);
    container.addEventListener(
        'click',
        (event) => {
            if (!suppressClick) return;

            event.preventDefault();
            event.stopPropagation();
            suppressClick = false;
        },
        true
    );
}

function initSliderControls(section) {
    const prevButton = qs('.nav-btn.prev', section);
    const nextButton = qs('.nav-btn.next', section);
    const grids = qsa('.slider-grid', section);

    if (!prevButton || !nextButton || grids.length === 0 || section.dataset.controlsReady === 'true') {
        return;
    }

    section.dataset.controlsReady = 'true';

    const updateButtons = () => {
        const grid = activeSliderGrid(section);
        if (!grid) return;

        const canScroll = grid.scrollWidth > grid.clientWidth;
        const isAtStart = grid.scrollLeft <= 0;
        const isAtEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;

        prevButton.disabled = !canScroll || isAtStart;
        nextButton.disabled = !canScroll || isAtEnd;

        prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        prevButton.style.cursor = prevButton.disabled ? 'not-allowed' : 'pointer';
        nextButton.style.cursor = nextButton.disabled ? 'not-allowed' : 'pointer';
    };

    prevButton.addEventListener('click', () => {
        const grid = activeSliderGrid(section);
        if (!grid) return;

        grid.scrollBy({ left: -scrollDistance(grid), behavior: 'smooth' });
        setTimeout(updateButtons, 300);
    });

    nextButton.addEventListener('click', () => {
        const grid = activeSliderGrid(section);
        if (!grid) return;

        grid.scrollBy({ left: scrollDistance(grid), behavior: 'smooth' });
        setTimeout(updateButtons, 300);
    });

    grids.forEach((grid) => {
        grid.addEventListener('scroll', updateButtons);
        grid.addEventListener('slider:refresh', updateButtons);
    });

    section.addEventListener('tab:change', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
}

export function initSliders() {
    qsa('.js-sm-slider .small-cards-container').forEach(initDragScroll);

    qsa('.games-slider-section').forEach((section) => {
        initSliderControls(section);
        qsa('.slider-grid', section).forEach(initDragScroll);
    });
}
