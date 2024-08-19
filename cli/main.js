#!/usr/bin/env node

// Defining the sleep function
const sleep = (ms = 500) => new Promise((r) => setTimeout(r, ms));

// Importing the required modules
import inquirer from 'inquirer';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: wolf <command>');
    process.exit(1);
}

const command = args[0];
const restArgs = args.slice(1);

// Showing wolf text with figlet.js
figlet('W O L F', (err, data) => {
    console.log(gradient.pastel.multiline(data));
    // console.log(data);
    
});

await sleep();

if (command == "gen") await gen();
if (command == "new") await _new();
if (command == "add") await add();


async function add() {
    const thing = await inquirer.prompt({
        name: 'add_thing',
        type: 'list',
        message: 'What do you want to add\n',
        choices: [
            'Melte (CSS Styling library)',
            'Melte Slim (Slim version of Melte)',
            'Tailwind CSS',
        ],
    });

    if (thing.add_thing == "Melte (CSS Styling library)") await add_$(`<!-- Melte --> 
<script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/melting-jquery.min.js"></script> 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/base.css" /> 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/utility.css" /> 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/fx.css" /> 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/components/carousel.css" /> 
<script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/attr.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/carousel.js"></script>`);
    if (thing.add_thing == "Melte Slim (Slim version of Melte)") await add_$(`<!-- Melte --> 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/base.css" /> 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/utility.css" /> 
<script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/attr.js"></script>`);
    if (thing.add_thing == "Tailwind CSS") {
        // Do you realy want to continue or install the faster and better Melte?
        const tailwind = await inquirer.prompt({
            name: 'tailwind',
            type: 'confirm',
            message: 'Do you really want to continue or install the faster and better Melte?',
        });
        if (!tailwind.tailwind) {
            console.log("Good choice!");
            // Slim or full version of Melte?
            const melte = await inquirer.prompt({
                name: 'melte',
                type: 'list',
                message: 'Do you want to add the full or slim version of Melte\n',
                choices: [
                    'Melte',
                    'Melte Slim',
                ],
            });

            if (melte.melte == "Melte") await add_$(`<!-- Melte --> 
                <script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/melting-jquery.min.js"></script> 
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/base.css" /> 
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/utility.css" /> 
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/fx.css" /> 
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/components/carousel.css" /> 
                <script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/attr.js"></script> 
                <script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/carousel.js"></script>`);
            if (melte.melte == "Melte Slim") await add_$(`<!-- Melte --> 
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/base.css" /> 
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/melte@2/src/css/utility.css" /> 
            <script src="https://cdn.jsdelivr.net/npm/melte@2/src/js/attr.js"></script>`);

            process.exit(1);
        }
        await add_$(`<!-- Tailwind CSS -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">`);
    }
}

async function gen() {
    const thing = await inquirer.prompt({
        name: 'gen_thing',
        type: 'list',
        message: 'What do you want to generate\n',
        choices: [
            'Component',
            'Route',
        ],
    });

    if (thing.gen_thing == "Component") await gen_component();
    if (thing.gen_thing == "Route") await gen_page();
}

async function _new() {
    const spinner = createSpinner('Creating new project...').start();
    const name = restArgs[0];
    await sleep(3500);
    fs.mkdirSync(path.join(process.cwd(), name), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), name, 'index.html'), `<!--
DO NOT REMOVE ANY COMMENTS 
THAT CONTAIN :wolf- OR !wolf-
OTHERWISE, THE CLI WILL NOT
WORK AS EXPECTED
AND A WOLF WILL EAT YOU
--> 
    
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="style.css">

    <!-- :wolf-head -->

    <!-- !wolf-head -->
</head>

<body>
    <noscript>
        <h1>This website requires JavaScript to run</h1>
    </noscript>
    <div id="app">
        <h1>loading..</h1>
    </div>
    <script type="module" src="app.js"></script>
</body>

</html>`);

    fs.writeFileSync(path.join(process.cwd(), name, 'app.js'), `
////////////////////////////////////////
// DO NOT REMOVE ANY COMMENTS 
// THAT CONTAIN :wolf- OR !wolf-
// OTHERWISE, THE CLI WILL NOT
// WORK AS EXPECTED
// AND A WOLF WILL EAT YOU
////////////////////////////////////////

import { App } from 'https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2';

// :wolf-imports
import "./src/layout.js";
import "./src/pages/home.js";
// !wolf-imports

App.setRoutes({
    // :wolf-routes
    "/": "home",
    // !wolf-routes
});

App.setLayout("layout");

App.mount("#app");`);


    fs.mkdirSync(path.join(process.cwd(), name, 'src'), { recursive: true });
    fs.mkdirSync(path.join(process.cwd(), name, 'src', 'components'), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), name, 'src', 'layout.js'), `import { component, html } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";


component("layout", () => {
    return html\`
        <wolf-slot></wolf-slot>
    \`;
});
`);

    fs.mkdirSync(path.join(process.cwd(), name, 'src', 'pages'), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), name, 'src', 'pages', 'home.js'), `import { component, html } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";


component("home", () => {
    return html\`
        <h1>Hello World!</h1>
    \`;
});`);

    fs.writeFileSync(path.join(process.cwd(), name, 'style.css'), ``);

    // wolf.config.json
    fs.writeFileSync(path.join(process.cwd(), name, 'wolf.config.json'), `{
    "name": "${name}",
    "pages_dir": "src/pages",
    "components_dir": "src/components"
}`);


    spinner.success('Project created successfully');
    await sleep(500);
}





////////////////////////////////////////
// Functions for the commands
////////////////////////////////////////

async function gen_component() {
    const component = await inquirer.prompt({
        name: 'gen_component',
        type: 'input',
        message: 'Enter the name of the component\n',
    });

    if (component.gen_component == "") {
        console.log("Please enter a valid name");
        process.exit(1);
    } else {
        const spinner = createSpinner(`Generating Component: ${component.gen_component}`).start();
        await sleep(2000);

        // Creating the component directory, ensuring all parent directories exist
        const componentPath = path.join(process.cwd(), 'src', 'components', component.gen_component);
        fs.mkdirSync(componentPath, { recursive: true });

        const jsCode = `import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via \`import "path/to/component.js"\`

component("${component.gen_component}", () => {
return html\`
    <h1>Hello World!</h1>
\`
});`;
        fs.writeFileSync(path.join(componentPath, `${component.gen_component}.js`), jsCode);
        fs.writeFileSync(path.join(componentPath, `${component.gen_component}.css`), "");

        spinner.success(`Generated Component: ${component.gen_component}`);
    }
}

////////////////////////////////////////////////////////////////////////////////////////

async function gen_page() {
    const page = await inquirer.prompt({
        name: 'gen_page',
        type: 'input',
        message: 'Enter the name of the page\n',
    });

    const route = await inquirer.prompt({
        name: 'gen_page_route',
        type: 'input',
        message: 'Enter the route of the page (without the first /)\n',
    });

    const spinner = createSpinner(`Generating Route`).start();
    await sleep(1500);

    const filePath = path.join(process.cwd(), 'app.js');
    console.log(filePath);

    // Die neue Route, die du hinzufügen möchtest
    const newRoute = `    "/${route.gen_page_route}": "${page.gen_page}"`;
    const newImport = `import "./src/pages/${page.gen_page}/${page.gen_page}.js";`;

    {
        // Datei lesen
        let fileContent = fs.readFileSync(filePath, 'utf-8');

        // Suchen nach den Kommentaren
        const startComment = '\\s*// :wolf-routes';
        const endComment = '\\s*// !wolf-routes';

        const regex = new RegExp(`(${startComment}[\\s\\S]*?\\n)([\\s\\S]*?)(\\n${endComment})`, 'g');

        // Neue Route zwischen den Kommentaren einfügen
        fileContent = fileContent.replace(regex, `$1${newRoute},\n$2$3`);

        // Datei wieder schreiben
        fs.writeFileSync(filePath, fileContent);
    }

    {
        // Datei lesen
        let fileContent = fs.readFileSync(filePath, 'utf-8');

        // Suchen nach den Kommentaren
        const startComment = '\\s*// :wolf-imports';
        const endComment = '\\s*// !wolf-imports';

        const regex = new RegExp(`(${startComment}[\\s\\S]*?\\n)([\\s\\S]*?)(\\n${endComment})`, 'g');

        // Neue Route zwischen den Kommentaren einfügen
        fileContent = fileContent.replace(regex, `$1${newImport}\n$2$3`);

        // Datei wieder schreiben
        fs.writeFileSync(filePath, fileContent);
    }


    // Creating the component directory, ensuring all parent directories exist
    const componentPath = path.join(process.cwd(), 'src', 'pages', page.gen_page);
    fs.mkdirSync(componentPath, { recursive: true });

    const jsCode = `import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via \`import "path/to/component.js"\`

component("${page.gen_page}", () => {
return html\`
    <h1>Hello World!</h1>
\`
});`;
    fs.writeFileSync(path.join(componentPath, `${page.gen_page}.js`), jsCode);
    fs.writeFileSync(path.join(componentPath, `${page.gen_page}.css`), "");

    spinner.success(`Generated Route`);
}



async function add_$(code) {
    const spinner = createSpinner('Adding dependency').start();
    await sleep(1000);
    const filePath = path.join(process.cwd(), 'index.html');


    let fileContent = fs.readFileSync(filePath, 'utf-8');

    const startComment = '\\s*<!-- :wolf-head -->';
    const endComment = '\\s*<!-- !wolf-head -->';

    const regex = new RegExp(`(${startComment}[\\s\\S]*?\\n)([\\s\\S]*?)(\\n${endComment})`, 'g');

    fileContent = fileContent.replace(regex, `$1${code}\n$2$3`);

    fs.writeFileSync(filePath, fileContent);
    spinner.success('Added dependency');
}