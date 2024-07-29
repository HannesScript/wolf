import { component, html, state } from "../../../wolf.js";

component("counter", () => {
    console.log("Counter rendered");
    let count = state(0);

    return html`
        <p>${count.get()}</p>
        <button onclick="${() => count.set(count.get() + 1)}">Increment</button>
    `;
});
