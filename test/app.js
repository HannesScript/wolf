import { App } from '../wolf.js';

import "./src/layout.js";


App.setRoutes({
    "/": "Home",
});

App.setLayout("layout");

App.mount("#app");