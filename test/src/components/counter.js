import { component, html, state } from "../../../wolf.js";

component("counter", () => {
    console.log("Counter rendered");
    let count = state(0);

    const increment = () => {
        alert("Incrementing");
        count.set(count.get() + 1)
    };

    return html`
        <p>${count.get()}</p>
        <button onclick="${increment}">Increment</button>
    `;
});