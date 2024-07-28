import { component, html } from "../../wolf.js";


component("layout", () => {
    return html`
        <h1>Wolf Test Page</h1>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <main>
            <wolf-slot></wolf-slot>
        </main>
    `;
});
