const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer'); // Add Puppeteer
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const pool = require("../databases/database");
const { get } = require('../routes/recipesRoutes');
const scrapMethods = require('../config/scrapMethods');

// Use the stealth plugin to evade detection
// puppeteer.use(StealthPlugin());

const scrapeRecipe = async (data) => {
    const url = data;
    const domain = scrapMethods.getDomain(url);
    console.log("Website to scrap: ", domain);
    const config = scrapMethods.websiteConfig[domain];

    if (!config) {
        throw new Error("It's not possible to scrap this website.");
    }
    
    let result = {
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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // If cookies in the website
    if (config['cookies'] !== undefined) {
        const handleCookies = async (retryCount = 3) => {
            for (let i = 0; i < retryCount; i++) {
                try {
                    await page.waitForSelector(config['cookies'].selector, { timeout: 10000 });
                    await page.click(config['cookies'].selector);
                    console.log('Cookie consent accepted.');
                    return;
                } catch (error) {
                    console.warn(`Retrying cookie consent (${i + 1}/${retryCount})...`);
                }
            }
            console.warn('Cookie consent button not found or already accepted.');
        };
        await handleCookies();
    }

    // Show hidden overlay in case we need an element inside
    if (config['overlay'] !== undefined ) {
        // Wait for the button that triggers the overlay
        await page.waitForSelector(config['overlay'].buttonSelector, { timeout: 10000 });

        // Click the button to trigger the element overlay
        await page.click(config['overlay'].buttonSelector);

        // Wait for the element to appear in the overlay
        await page.waitForSelector(config['overlay'].selector, { timeout: 10000 });
    }

    const html_data = await page.content();
    await browser.close();

    const $ = cheerio.load(html_data);

    Object.keys(config).forEach(key => {
        const { selector, index, attribute, type, value } = config[key];

        if (attribute) {
            result[key] = scrapMethods.getAttribute($, selector, attribute);
        } else if (index !== undefined) {
            result[key] = scrapMethods.getTextByIndex($, selector, index);
        } else if (type === "list") {
            result[key] = scrapMethods.getListItems($, selector, scrapMethods.trimString);
        } else {
            console.log($(selector).text())
            result[key] = scrapMethods.getText($, selector);
        }
    });

    // Apply additional formatting if defined
    if (config.format) {
        result = config.format($, result);
    }

    result.persons = scrapMethods.extractNumbers(result.persons);

    return result;
};

const addRecipe = async (data) => {
    const recipe = await scrapeRecipe(data);
    const userId = 10;

    values = [userId, recipe.title, recipe.imageUrl, recipe.persons, recipe.prepTime, recipe.restTime, recipe.cookTime, recipe.ingredients, recipe.steps, recipe.source]
    const insertSTMT = `INSERT INTO recipesbook (user_id, title, image_url, persons, prep_time, rest_time, cook_time, ingredients, steps, source) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    await pool.query(insertSTMT, values);
}

// const addRecipe = async (data) => {
//     const recipe = data.recipe;
//     const userId = data.user.id;
    
//     // Insert user into the database
//     const insertSTMT = `INSERT INTO recipesBook (userId, title, persons, prepTime, restTime, cookTime, ingredients, steps, source) VALUES ('${user.userId}', '${recipe.title}', '${recipe.persons}', '${recipe.prepTime}', '${recipe.restTime}', '${recipe.cookTime}', '${recipe.ingredients}', '${recipe.steps}', '${recipe.source}')`;
//     await pool.query(insertSTMT);
// }

const deleteRecipe = async (data) => {
    const recipeId = data.recipeId;
    const userId = data.user.id
    
    // Insert user into the database
    const insertSTMT = `DELETE FROM recipeBooks WHERE recipeId = userId AND userId = userId; VALUES ('${recipeId}', '${userId}')`;
    await pool.query(insertSTMT);
}

const userRecipes = async (data) => {
    const userId = data
    
    // Get all the user recipes
    res = await pool.query(`SELECT * FROM recipesbook WHERE user_id = $1`, [userId]);

    return res.rows;
}



module.exports =  {
    scrapeRecipe,
    addRecipe,
    deleteRecipe,
    userRecipes
};
