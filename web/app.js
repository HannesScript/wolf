import { App } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`
import "./src/layout.js";
import "./src/pages/home.js";

App.setRoutes({
    "/": "home",
});

App.setLayout("layout");

App.mount("#app");
