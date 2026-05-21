# AI Agent Instructions

This is a small static note-taking web app built with vanilla HTML, CSS, and JavaScript.

## Project overview
- Single-page app: `index.html`, `style.css`, `script.js`.
- Saves note content in browser `localStorage` under key `blocoDeNotas-conteudo`.
- No build system, no dependencies, no backend.
- User-facing language is Portuguese (`pt-BR`).

## Key files
- `index.html`: app structure and accessibility basics.
- `style.css`: visual styling and layout.
- `script.js`: app behavior, event listeners, debounced autosave, and localStorage support.
- `README.md`: basic project description.

## Guidance for code changes
- Keep the app lightweight and static.
- Preserve Portuguese UI text unless asked to add a language switcher or translation support.
- Use feature detection for `localStorage` and handle unavailable storage gracefully.
- Prefer progressive enhancement: app should degrade politely if JavaScript is disabled.
- No tests or build commands are present in this repository.

## Useful notes
- The current app autosaves on input and exposes manual `Salvar` and `Limpar` buttons.
- `index.html` includes a `noscript` fallback message.
- If adding features, keep the interface simple and maintain the accessible structure.
