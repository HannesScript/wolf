import { App } from '../wolf.js';

import "./src/layout.js";
import "./src/pages/not-found.js";
import "./src/pages/home.js";
import "./src/pages/about.js";


App.setRoutes({
    "/": "home",
    "/about": "about",
});

App.setLayout("layout");

App.setNotFound("not-found");

App.mount("#app");