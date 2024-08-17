#!/usr/env/bin node

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
figlet('Wolf', (err, data) => {
    console.log(gradient.pastel.multiline(data));
});

await sleep();

if (command == "gen") await gen();

async function gen() {
    const thing = await inquirer.prompt({
        name: 'gen_thing',
        type: 'list',
        message: 'What do you want to generate\n',
        choices: [
            'Component',
            'Page [UNDER DEVELOPMENT]',
        ],
    });

    if (thing.gen_thing == "Component") {
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
import "./${component.gen_component}.css";

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
}
