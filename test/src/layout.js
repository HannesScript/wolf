import { component, html } from "../../wolf.js";


component("layout", () => {
    return html`
        <h1>Wolf Test Page</h1>
        <img src="../wolf.png" alt="random image" class="img-lg" />
        <div>
            <a href="/" class="ml-16 text-blue-900" melte-hover="text-blue-500">Home</a>
            <a href="/about" class="ml-16 text-blue-900" melte-hover="text-blue-500">About</a>
        </div>
        <hr>
        <main>
            <wolf-slot></wolf-slot>
        </main>
    `;
});
