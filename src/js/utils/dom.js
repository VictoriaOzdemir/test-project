export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

export function setHtml(element, html) {
    if (!element) return;
    element.innerHTML = html;
}
