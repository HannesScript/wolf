import { component, html } from "../../wolf.js";

component("not-found", () => {
    return html`
        <h1>Error: 404</h1>
        <p>Page not found</p>
    `;
});