import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`


component("layout", () => {
    return html`
        <h1>Hello World!</h1>
        <br>
        <br>
        <br>
        <br>
        <wolf-slot></wolf-slot>
    `
});