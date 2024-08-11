import { component, html, state } from "../../../wolf.js";

component("counter", (props) => {
    state.create("count", props.start || 0);

    const increment = () => {
        state.set("count", state.get("count") + 1);
    };

    return html`
        <p>${state.get("count")}</p>
        <button on:click="${increment}">Increment</button>
    `;
});

component("myc", () => {
    return html`
        <h1>My component</h1>
        ${state.get('count')} + ${state.get('count') * 2} = ${(state.get('count') + state.get('count') * 2).toFixed(0)}
    `;
});