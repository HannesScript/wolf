import { component, html } from "../../wolf.js";


component("layout", () => {
    return html`
        <h1>Wolf Test Page</h1>
        <main>
            <wolf-slot></wolf-slot>
        </main>
    `;
});
