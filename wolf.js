export let html = htmlString => htmlString;
export let css = cssString => cssString;

class Component extends HTMLElement {
    constructor() {
        super();
        this.state = {};
        this.render();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.update();
    }

    render() {
        this.innerHTML = this.template();
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
let currentHookIndex = 0;

const component = (Name, renderFn) => {
    currentComponent = renderFn;
    currentHookIndex = 0;

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

const state = (initialValue) => {
    const componentId = currentComponent;
    if (!hooks.has(componentId)) {
        hooks.set(componentId, []);
    }

    const hookArray = hooks.get(componentId);

    if (hookArray.length <= currentHookIndex) {
        hookArray.push(initialValue);
    }

    const stateIndex = currentHookIndex;

    const getState = () => hookArray[stateIndex];
    const setState = newValue => {
        hookArray[stateIndex] = newValue;
        requestAnimationFrame(App.update); // Ensures update is called only once per frame
    };

    currentHookIndex++;
    return { get: getState, set: setState };
};

const createDomElement = (vNode) => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    const element = document.createElement(vNode.tag);

    // Ensure vNode.props is an object
    const props = vNode.props || {};

    // Set attributes
    Object.keys(props).forEach(key => {
        if (key.startsWith("on")) {
            element[key.toLowerCase()] = props[key];
        } else {
            element.setAttribute(key, props[key]);
        }
    });

    // Ensure vNode.children is an array
    const children = vNode.children || [];

    // Append children
    children.forEach(child => {
        element.appendChild(createDomElement(child));
    });

    return element;
};

// Existing code
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