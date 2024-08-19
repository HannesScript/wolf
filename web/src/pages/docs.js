import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`


component("docs", () => {
    return html`
        <div class="content-center pb-32">
            <h1 class="text-center">Wolf Documentation</h1>
            <p>Wolf is a simple, lightweight, and fast front-end framework that makes it easy to build responsive web applications. <br>
            Soon Wolf will have a very powerful CLI, but it's in progress right now.</p>
            <br>
            <h2>Getting Started</h2>
            <p>To get up and running with Wolf, run the following commands:</p>
            <pre class="text-orange-300 bg-gray-900 br-8 p-8">
<code>${"$ npm install -g wolf-framework-cli"}</code>
<code>${"$ wolf new my-wolf-app"}</code>
<code>${"$ wolf add melte  # Add Melte (<a class=\"text-orange-400\" href=\"https://melte.hannesscript.dev\">https://melte.hannesscript.dev</a>) for easier styling"}</code>
            </pre>
            <p>This will create a new Wolf project in the current directory. Now you can <br>
            build your Apps or Websites with Wolf!</p>
            <br>
            <h2>Project Structure</h2>
            <p>Wolf projects have the following structure:</p>
            <pre class="text-orange-300 bg-gray-900 br-8 p-8">
${`
my-wolf-app/
├── index.html
├── style.css
├── app.js
├── src/
│   ├── layout.js
│   ├── pages/
│   │   │ // Pages will be here
│   │   ├── home.js
│   │   └── error-404.js
│   └── components/
│       │ // Components will be here
│       ├── header.js
│       ├── counter.js
│       └── footer.js
`}
            </pre>
            <br>
            <h3>Files:</h3>
            <ul class="list-disc">
                <li><b>index.html:</b> The main HTML file of your project. This file is just for including some CSS files <br>
                 and the app container in which wolf will put in the Website.</li>
                <li><b>style.css:</b> The main CSS file of your project. Here is your CSS code for styling.</li>
                <li><b>app.js:</b> The main JavaScript file of your project. This file initializes your Wolf application <br>
                and sets the routes, layout, error page and imports the "root level" components (the layout, error page and pages).</li>
                <li><b>src/layout.js:</b> The layout file of your project. <br>
                The slot where the current page will be in is a special html element ("&lt;wolf-slot&gt;&lt;/wolf-slot&gt;")</li>
                <li><b>src/pages/:</b> The folder where you can put your pages.</li>
                <li><b>src/components/:</b> The folder where you can put your components.</li>
            </ul>
        </div>
    `
});