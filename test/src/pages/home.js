import { component, html } from "../../../wolf.js";

import "../components/counter.js";

component("home", () => {
    return html`
        <h2>home</h2>
        <cmpt-counter></cmpt-counter>
        <cmpt-myc></cmpt-myc>
    `;
});