import { App } from '../wolf.js';

import "./src/layout.js";
import "./src/not-found.js";


App.setRoutes({
    "/": "Home",
});

App.setLayout("layout");

App.setNotFound("not-found");

App.mount("#app");