import { App } from '../wolf.js';

import "./src/layout.js";
import "./src/not-found.js";
import "./src/home.js";
import "./src/about.js";


App.setRoutes({
    "/": "home",
    "/about": "about",
});

App.setLayout("layout");

App.setNotFound("not-found");

App.mount("#app");