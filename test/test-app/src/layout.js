import { component, html } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";


component("layout", () => {
    return html`
        <wolf-slot></wolf-slot>
    `;
});
