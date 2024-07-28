import { component } from "../../wolf.js";


component("layout", () => {
    return `
        <h1>Wolf Test Page</h1>
        <main>
            <Slot></Slot>
        </main>
    `;
});
