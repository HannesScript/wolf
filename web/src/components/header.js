import { component, html, css } from "https://cdn.jsdelivr.net/npm/wolf-framework@1.0.2";

// Import any components you need via `import "path/to/component.js"`


component("header", () => {
    return html`
        <style>
            @media screen and (max-width: 768px) {
                .header h1 {
                    font-size: 2.5rem !important;
                    margin-left: 0rem !important;
                }

                .header img {
                    height: 4rem !important;
                }
            }
        </style>
        <div class="header flex p-8 align-start justify-between mb-32">
            <a href="/" class="text-white line-none">
                <div class="flex align-center">
                    <img src="wolf.png" class="img-md" alt="Wolf Logo" />
                    <h1 class="ml-8" style="font-family: 'Lilita One', sans-serif; font-size: 5rem;">WOLF</h1>
                </div>
            </a>
            <nav class="flex align-center gap-2 pt-16 pr-32">
                <a href="/" class="text-blue-100 line-none" melte-hover="text-blue-300">Home</a>
                <a href="/docs" class="text-blue-100 line-none" melte-hover="text-blue-300">Docs</a>
            </nav>
        </div>
    `
});