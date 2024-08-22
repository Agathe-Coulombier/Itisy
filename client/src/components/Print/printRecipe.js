import { itisy } from './ItisyStyle';
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";

export const handlePrint = (recipe) => {
    if (!recipe) return;

    // Remove any existing iframe to ensure a fresh one is created
    const existingIframe = document.querySelector('#printIframe');
    if (existingIframe) {
        document.body.removeChild(existingIframe);
    }

    // Create a new hidden iframe for printing
    const printIframe = document.createElement('iframe');
    printIframe.id = 'printIframe';  // Add an ID to reference later
    printIframe.style.position = 'absolute';
    printIframe.style.top = '-1000px';
    printIframe.style.left = '-1000px';
    document.body.appendChild(printIframe);

    const iframeDocument = printIframe.contentWindow.document;
    iframeDocument.open();

    iframeDocument.write(`
        <html>
            <head>
                <style>${itisy}</style> <!-- Inject the CSS styles -->
            </head>
            <body>
                <div class="recipe-content">
                    <!-- Left Column -->
                    <div class="recipe-left">
                        <div class="recipe-image-container">
                            <img class="recipe-image" src="${recipe.image_url}" alt="${recipe.title}">
                        </div>
                        <h1 class="recipe-title">${recipe.title}</h1>
                        <div class="recipe-meta">
                            <div class="meta-item">
                                <span class="meta-icon">
                                    <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" class="recipe-item-logo" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"></path></svg>
                                </span> ${recipe.persons || 1}
                            </div>
                            <div class="meta-item">
                                <span class="meta-icon">
                                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="recipe-item-logo" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1z"></path><path d="M8 7c1.657 0 3 -.895 3 -2s-1.343 -2 -3 -2s-3 .895 -3 2s1.343 2 3 2"></path><path d="M11 5h9"></path></svg>
                                </span> ${recipe.prep_time || '-'}
                            </div>
                            <div class="meta-item">
                                <span class="meta-icon">
                                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="recipe-item-logo" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 7h.01"></path><path d="M15 7h.01"></path><path d="M9 7h.01"></path><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path><path d="M9 15h6"></path><path d="M5 11h14"></path></svg>
                                </span> ${recipe.cook_time || '-'}
                            </div>
                            <div class="meta-item">
                                <span class="meta-icon">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="recipe-item-logo" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18.998 1C19.5503 1 19.998 1.44772 19.998 2V22C19.998 22.5523 19.5503 23 18.998 23H4.99805C4.44576 23 3.99805 22.5523 3.99805 22V2C3.99805 1.44772 4.44576 1 4.99805 1H18.998ZM17.998 12H5.99805V21H17.998V12ZM9.99805 14V18H7.99805V14H9.99805ZM17.998 3H5.99805V10H17.998V3ZM9.99805 5V8H7.99805V5H9.99805Z"></path></svg>
                                </span> ${recipe.rest_time || '-'}
                            </div>
                        </div>
                    </div>
                    <!-- Right Column -->
                    <div class="recipe-right">
                        <div class="recipe-ingredients">
                            <h2>Ingredients</h2>
                            <ul>
                                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                            <p class="recipe-source">${recipe.source || ""}</p>
                        </div>
                        <div class="recipe-steps">
                            <h2>Steps</h2>
                            <ol>
                                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);

    iframeDocument.close();

    // Wait for the iframe to load fully before printing
    printIframe.onload = () => {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();

        setTimeout(() => {
            document.body.removeChild(printIframe);
        }, 1000);
    };
};
