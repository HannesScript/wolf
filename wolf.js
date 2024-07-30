const eventHandlers = [];
const states = new Map();
const stateWatchers = new Map();
const timesRendered = new Map();

export function html(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i];
        if (typeof value === "function") {
            eventHandlers.push(value);
            return result + string + `__event__${eventHandlers.length - 1}`;
        }
        return result + string + (value !== undefined ? value : "");
    }, "")
    .replaceAll("on:", "on")
}

export let css = cssString => cssString;

class Component extends HTMLElement {
    constructor() {
        super();
        this.state = {};
        this.vdom = this.template();
        this.render();
    }

    setState(newState) {
        const hasChanged = Object.keys(newState).some(key => this.state[key] !== newState[key]);
        if (hasChanged) {
            this.state = { ...this.state, ...newState };
            this.update();
        }
    }

    render() {
        this.innerHTML = this.template();
        attachEventHandlers(this);
    }

    update() {
        const newVNode = this.template();
        const patches = diff(newVNode, this.vdom);
        patch(this, patches);
        this.vdom = newVNode;
    }

    connectedCallback() {
        this.update();
    }

    template() {
        return html`<${currentComponent}></${currentComponent}>`;
    }
}

const hooks = new Map();
let currentComponent = null;
let currentComponentName = null;
let currentHookIndex = 0;

const component = (Name, renderFn) => {
    currentComponent = renderFn;
    currentHookIndex = 0;
    currentComponentName = Name;

    class CustomComponent extends Component {
        constructor() {
            super();
            this.state = {};
        }

        template() {
            return renderFn({ ...this.attributes, children: this.children, state: this.state });
        }
    }

    window.customElements.define("cmpt-" + Name, CustomComponent);
    currentComponent = null;
    return CustomComponent;
};

const state = {
    set(state, value) {
        if (!states.has(state)) {
            // console.warn(`State ${state} not found`);
            return false;
        }
        states.set(state, value);
        notifyWatchers(state);
        App.update();
    },

    get(state) {
        if (!states.has(state)) {
            // console.warn(`State ${state} not found`);
            return false;
        }
        return states.get(state);
    },

    create(state, initialValue) {
        if (states.has(state)) {
            // console.warn(`State ${state} already exists`);
            return;
        }
        states.set(state, initialValue);
    },

    delete(state) {
        if (!states.has(state)) throw new Error(`State ${state} not found`);
        states.delete(state);
    }
};

const createDomElement = (vNode, eventHandlers = []) => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    const element = document.createElement(vNode.tag);

    // Ensure vNode.props is an object
    const props = vNode.props || {};

    // Set attributes
    Object.keys(props).forEach(key => {
        if (key.startsWith("on")) {
            const eventIndex = parseInt(props[key].replace('__event__', ''), 10);
            element[key.toLowerCase()] = eventHandlers[eventIndex];
        } else {
            element.setAttribute(key, props[key]);
        }
    });

    // Ensure vNode.children is an array
    const children = vNode.children || [];

    // Append children
    children.forEach(child => {
        element.appendChild(createDomElement(child, eventHandlers));
    });

    return element;
};

export function $onrender(callback, onNthRender = Infinity) {
    if(!currentComponentName) {return;}
    if(!timesRendered.has(currentComponentName)) {
        timesRendered.set(currentComponentName, 0);
    }

    if(timesRendered.get(currentComponentName) <= onNthRender) {
        callback();
        timesRendered.set(currentComponentName, timesRendered.get(currentComponentName) + 1);
    }
}

const diff = (newVNode, oldVNode) => {
    if (!oldVNode) {
        return { type: 'CREATE', newVNode };
    }
    if (!newVNode) {
        return { type: 'REMOVE' };
    }
    if (newVNode.tag !== oldVNode.tag) {
        return { type: 'REPLACE', newVNode };
    }
    if (typeof newVNode !== 'object') {
        if (newVNode !== oldVNode) {
            return { type: 'TEXT', newVNode };
        } else {
            return null;
        }
    }

    const propPatches = [];
    const allProps = { ...newVNode.props, ...oldVNode.props };
    Object.keys(allProps).forEach(key => {
        const newVal = newVNode.props[key];
        const oldVal = oldVNode.props[key];
        if (newVal !== oldVal) {
            propPatches.push({ key, value: newVal });
        }
    });

    const childrenPatches = [];
    const maxLength = Math.max(newVNode.children.length, oldVNode.children.length);
    for (let i = 0; i < maxLength; i++) {
        childrenPatches.push(diff(newVNode.children[i], oldVNode.children[i]));
    }

    return { type: 'UPDATE', propPatches, childrenPatches };
};

const patch = (parent, patches, index = 0) => {
    if (!patches) return;

    const element = parent.childNodes[index];

    switch (patches.type) {
        case 'CREATE': {
            const newElement = createDomElement(patches.newVNode);
            parent.appendChild(newElement);
            break;
        }
        case 'REMOVE': {
            parent.removeChild(element);
            break;
        }
        case 'REPLACE': {
            const newElement = createDomElement(patches.newVNode);
            parent.replaceChild(newElement, element);
            break;
        }
        case 'TEXT': {
            element.textContent = patches.newVNode;
            break;
        }
        case 'UPDATE': {
            patches.propPatches.forEach(({ key, value }) => {
                if (key.startsWith("on")) {
                    element[key.toLowerCase()] = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            patches.childrenPatches.forEach((childPatch, i) => {
                patch(element, childPatch, i);
            });
            break;
        }
    }
};

function attachEventHandlers(container) {
    eventHandlers.forEach((handler, index) => {
        const elements = container.querySelectorAll(`[onclick="__event__${index}"]`);
        elements.forEach(element => {
            element.removeAttribute("onclick"); // Clean up the placeholder
            element.onclick = (event) => {
                const prevState = { ...container.state };
                handler(event);
                const newState = { ...container.state };
                const hasChanged = Object.keys(newState).some(key => prevState[key] !== newState[key]);
                if (hasChanged) {
                    container.update();
                }
            };
        });
    });
}

const App = {
    routes: {},
    layoutComponent: null,
    currentPage: null,
    mountPoint: null,
    vdom: null,
    errorPage: html`
        <h1>404</h1>
        <p>Page not found</p>
    `,
    setRoutes(routeMap) {
        let RouteMap = {};

        for (let route in routeMap) {
            const componentName = routeMap[route];
            const Component = window.customElements.get("cmpt-" + componentName);
            RouteMap[route] = () => new Component().innerHTML;
        }

        this.routes = RouteMap;
    },

    setLayout(layoutComponent = "wolf-layout") {
        this.layoutComponent = "cmpt-" + layoutComponent;
    },

    setNotFound(notFoundComponent) {
        const NotFound = window.customElements.get("cmpt-" + notFoundComponent);
        this.errorPage = new NotFound()?.innerHTML;
    },

    mount(selector) {
        this.mountPoint = document.querySelector(selector);
        this.mountPoint.innerHTML = "<wolf-app></wolf-app>";
        this.update();
        window.onpopstate = () => {
            this.update();
        };
    },

    update() {
        this.redirect();
        const path = (window.location.hash || "#/").slice(1);
        const routeComponent = this.routes[path];
        this.currentPage = () => routeComponent();

        const Layout = window.customElements.get(this.layoutComponent);
        this.mountPoint.querySelector("wolf-app").innerHTML = new Layout().innerHTML;

        this.handleLinks();
    },

    handleLinks() {
        const links = document.querySelectorAll("a");
        links.forEach(link => {
            if (link.getAttribute("href").startsWith("#")) return;
            link.setAttribute("href", "#" + link.getAttribute("href"));
        });
    },

    redirect() {
        if (!window.location.hash.slice(1)) {
            window.location.hash = "#/";
        }
    }
};

function notifyWatchers(state) {
    if (stateWatchers.has(state)) {
        stateWatchers.get(state).forEach(callback => callback());
    }
}

/**
 * @description When one of the dependencies changes, the callback is called
 * @param {Function} callback 
 * @param {Array} dependencies
 */
export function $watch(callback, dependencies) {
    dependencies.forEach(dep => {
        if (!stateWatchers.has(dep)) {
            stateWatchers.set(dep, []);
        }
        stateWatchers.get(dep).push(callback);
    });
}
class WolfSlot extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = App.currentPage ? App.currentPage() : App.errorPage;
    }
}

window.customElements.define("wolf-slot", WolfSlot);

export { component, state, App };