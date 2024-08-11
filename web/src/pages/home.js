import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`


component("home", () => {
    return html`
        <div class="flex flex-col align-center justify-center gap-1">
            <img src="wolf.png" class="img-xxl" alt="Wolf Logo" />
            <h1 class="mr-32" style="font-family: 'Lilita One', sans-serif; font-size: 3rem; font-weight: 100;">Wolf</h1>
        </div>
    `
});