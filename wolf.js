export let html = htmlString => htmlString;
export let css = cssString => cssString;

const hooks = new Map();
let currentComponent = null;
let currentHookIndex = 0;

const component = (Name, renderFn) => {
    currentComponent = renderFn;
    currentHookIndex = 0;

    class Component extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.innerHTML = renderFn({ ...this.attributes, children: this.children });
        }

        connectedCallback() {
            this.shadowRoot.innerHTML = html`<${currentComponent}></${currentComponent}>`;
        }
    }

    window.customElements.define("wolf-component-" + Name, Component);
    currentComponent = null;
    return Component;
};

const state = (initialValue) => {
    if (!currentComponent) {
        throw new Error("state() can only be called inside a component function");
    }

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
        this.routes = routeMap;
    },

    setLayout(layoutComponent = "wolf-layout") {
        this.layoutComponent = "wolf-component-" + layoutComponent;
    },

    setNotFound(notFoundComponent) {
        const NotFound = window.customElements.get("wolf-component-" + notFoundComponent);
        this.errorPage = new NotFound()?.shadowRoot.innerHTML;
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
        this.mountPoint.querySelector("wolf-app").innerHTML = new Layout().shadowRoot.innerHTML;

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

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = currentComponent ? html`<${currentComponent}></${currentComponent}>`
        : App.errorPage;

        // this.shadowRoot.innerHTML = `<h2>Hello</h2>`;
    }
}

window.customElements.define("wolf-slot", WolfSlot);

export { component, state, App };