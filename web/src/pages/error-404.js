import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`


component("error-404", () => {
    return html`
        <div class="flex flex-col align-center justify-center">
            <div class="mb-64">
                <img src="img/404.svg" class="img-xxl rotate" alt="A cat hanging in the zero (from 404) trying to reach a ball of wool" />
            </div>
            <h1 class="text-red-700" style="font-family: 'Lilita One', sans-serif; font-size: 6rem; font-weight: 100;">404</h1>
            <h2 style="font-family: 'Lilita One', sans-serif; font-size: 2rem; font-weight: 100;">Page Not Found</h2>
        </div>
    `
});