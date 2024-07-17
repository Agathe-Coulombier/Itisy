const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer'); // Add Puppeteer
const { get } = require('../routes/recipesRoutes');

// Functioning websites:

// marmiton.org
// elle.fr 

const trimString = function trimString(input) {
    return input.replace(/\r\n|\n|\r/gm, "").replace(/\s+/g, ' ').trim();
}

const getDomain = (url) => {
    const matches = url.match(/^https?:\/\/(?:www\.)?([^\/]+)\/?/i);
    return matches && matches[1];
};

const recipeMethods = {
    "marmiton.org": {
        title: { selector: ".main-title > h1" },
        imageUrl: { selector:".recipe-media-viewer-thumbnail img", attribute: 'data-src' },
        persons: { selector: ".recipe-ingredients__qt-counter__value_container input", attribute:'value' },
        prepTime: { selector: ".recipe-preparation__time .time__details div div", index: 0 },
        restTime: { selector: ".recipe-preparation__time .time__details div div", index: 1 },
        cookTime: { selector: ".recipe-preparation__time .time__details div div", index: 2 },
        ingredients: { selector: ".card-ingredient-title", type: "list"},
        steps: { selector: ".recipe-step-list p", type: "list"}
    },
    "elle.fr": {
        title: { selector: ".article__title" },
        imageUrl: { selector:".article__picture img", attribute: 'src' },
        persons: { selector: ".article__detail-value", index:0},
        prepTime: { selector: ".article__detail-value", index:1 },
        restTime: {},
        cookTime: { selector: ".article__detail-value", index:2 },
        ingredients: { selector: "ul.article-body__list li", type: "list"},
        steps: { selector: "ol.article-body__list p", type: "list"}
    },
    "cuisineaz.com": {
        title: { selector: ".recipe-title" },
        imageUrl: { selector:".article__picture img", attribute: 'src' },
        persons: { selector: "#LblRecetteNombre"},
        prepTime: { selector: ".recipe_infos-icons div", index:0 },
        restTime: {},
        cookTime: {},
        ingredients: { selector: "ingredient_label", type: "list"},
        steps: { selector: ".instructions", type: "list"}
    }

};

const getText = ($, selector) => trimString($(selector).text());

const getTextByIndex = ($, selector, index) => trimString($(selector).eq(index).text());

const getAttribute = ($, selector, attribute) => {
    return $(selector).attr(attribute);
}
const getListItems = ($, selector, trimString) => {
    const items = [];
    $(selector).each((index, element) => {
        const item = trimString($(element).text());
        if (item) {
            items.push(item);
        }
    });
    return items;
};

const scrapeRecipe = async (data) => {
    const url = data.url;
    const domain = getDomain(url);
    console.log(domain);
    const method = recipeMethods[domain];

    if (!method) {
        throw new Error("It's not possible to scrap this website.");
    }
    
    const result = {
        "title": null,
        "imageUrl": null,
        "persons": null,
        "prepTime": null,
        "restTime": null,
        "cookTime": null,
        "ingredients": null,
        "steps": null,
        "source": domain
    };

    // Use Puppeteer to fetch the page content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const html_data = await page.content();
    await browser.close();

    const $ = cheerio.load(html_data);

    console.log($('.recipe-ingredients__qt-counter__value_container span').text());

    Object.keys(method).forEach(key => {
        const { selector, index, attribute, type, value } = method[key];

        if (attribute) {
            result[key] = getAttribute($, selector, attribute);
        } else if (index !== undefined) {
            result[key] = getTextByIndex($, selector, index);
        } else if (type === "list") {
            result[key] = getListItems($, selector, trimString);
        } else {
            result[key] = getText($, selector);
        }
    });

    return result;
};

module.exports = {
    scrapeRecipe,
};
