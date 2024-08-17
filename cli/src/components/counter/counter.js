import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";
import "./counter.css";

// Import any components you need via `import "path/to/component.js"`

component("counter", () => {
    return html`
        <h1>Hello World!</h1>
    `
});