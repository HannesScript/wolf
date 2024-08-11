import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`
import "./components/header.js";

component("layout", () => {
    return html`
        <cmpt-header></cmpt-header>
        <wolf-slot></wolf-slot>
    `
});