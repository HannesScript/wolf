import { component, html } from "../../../wolf.js";

import "../components/counter.js";

component("home", () => {
    console.log("Home rendered");

    return html`
        <h2>home</h2>
        <cmpt-counter></cmpt-counter>
        <cmpt-myc></cmpt-myc>
    `;
});