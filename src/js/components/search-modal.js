import { modalTopGames, searchGames } from '../data/games.js';
import { gameCardTemplate } from '../templates/cards.js';
import { qs, setHtml } from '../utils/dom.js';

const selectors = {
    modal: '#search-modal',
    input: '#game-search-input',
    clearButton: '#clear-search',
    heading: '[data-search-heading]',
    results: '#modal-results-grid-inner',
};

function renderResults({ heading, games, emptyMessage }) {
    const headingElement = qs(selectors.heading);
    const resultsElement = qs(selectors.results);

    setHtml(headingElement, heading ? `<h2 class="heading-result">${heading}</h2>` : '');
    setHtml(
        resultsElement,
        emptyMessage ? `<h2 class="no-results">${emptyMessage}</h2>` : games.map((game) => gameCardTemplate(game)).join('')
    );
}

function updateSearchResults(query = '') {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        renderResults({
            heading: 'Top games',
            games: modalTopGames.slice(0, 12),
        });
        return;
    }

    const filteredGames = searchGames.filter((game) => game.title.toLowerCase().includes(normalizedQuery));

    renderResults({
        heading: '',
        games: filteredGames,
        emptyMessage: filteredGames.length === 0 ? 'No games found' : '',
    });
}

export function initSearchModal() {
    const modal = qs(selectors.modal);
    const input = qs(selectors.input);
    const clearButton = qs(selectors.clearButton);

    if (!modal || !input || !clearButton) return;

    modal.addEventListener('toggle', (event) => {
        if (event.newState === 'open') {
            updateSearchResults(input.value);
        }
    });

    input.addEventListener('input', (event) => {
        updateSearchResults(event.target.value);
    });

    clearButton.addEventListener('click', () => {
        input.value = '';
        updateSearchResults();
    });
}
