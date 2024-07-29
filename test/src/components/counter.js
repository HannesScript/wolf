import { component, html, state } from "../../../wolf.js";

component("counter", () => {
    console.log("Counter rendered");
    // In your counter.js or wherever you are creating the state
    if (!state.get('count')) {
        state.create('count', 0);
    }

    const increment = () => {
        alert("Incrementing");
        state.set("count", state.get("count") + 1)
        console.log(state.get("count"));
    };

    return html`
        <p>${state.get("count")}</p>
        <button onclick="${increment}">Increment</button>
    `;
});

component("myc", () => {
    console.log("My component rendered");

    return html`
        <h1>My component</h1>
        5 + 5 = ${5 + 5}
    `;
});