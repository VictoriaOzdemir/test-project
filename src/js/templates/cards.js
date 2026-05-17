import { PLAY_ICON_URL } from '../data/games.js';

export function gameCardTemplate(game, headingLevel = 3) {
    const headingTag = `h${headingLevel}`;
    const imageAlt = game.imageAlt || game.title;

    return `
        <li class="game-card">
            <div class="image-wrapper">
                <img src="${game.image}" alt="${imageAlt}" loading="lazy">
                <div class="overlay">
                    <a href="#" class="btn play-btn">Play</a>
                    <a href="#" class="btn demo-btn">Demo</a>
                </div>
            </div>
            <div class="card-title">
                <img class="play-ico-sm" aria-hidden="true" src="${PLAY_ICON_URL}" alt="">
                <${headingTag} class="card-heading">${game.title}</${headingTag}>
            </div>
        </li>
    `;
}
