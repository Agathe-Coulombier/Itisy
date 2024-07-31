const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer'); // Add Puppeteer
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const pool = require("../databases/database");
const { get } = require('../routes/recipesRoutes');
const scrapMethods = require('../config/scrapMethods');

// Use the stealth plugin to evade detection
// puppeteer.use(StealthPlugin());

const scrapeRecipe = async (data, retries = 4, delay = 1000) => {
    const url = data;
    const domain = scrapMethods.getDomain(url);
    console.log("Website scrapping: ", domain);
    const config = scrapMethods.websiteConfig[domain];

    if (!config) {
    throw new Error("This website isn't configured and therefore can't be scrapped.");
    }

    let result = {
    title: null,
    imageUrl: null,
    persons: null,
    prepTime: null,
    restTime: null,
    cookTime: null,
    ingredients: null,
    steps: null,
    source: domain,
    };

    const scrape = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Handle cookies if needed
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

    // Handle overlay if needed
    if (config['overlay'] !== undefined) {
        await page.waitForSelector(config['overlay'].buttonSelector, { timeout: 10000 });
        await page.click(config['overlay'].buttonSelector);
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
        result[key] = scrapMethods.getText($, selector);
        }
    });

    // Apply additional formatting if defined
    if (config.format) {
        result = config.format($, result);
    }

    result.persons = scrapMethods.extractNumbers(result.persons);

    // Check if data was fetched correctly
    if (result.title === '' && !result.ingredients.length && !result.steps.length && result.source !== '') {
        throw new Error("Data can't be retrieved from the url you provided");
    }

    return result;
    };

    // Retry mechanism
    for (let attempt = 1; attempt <= retries; attempt++) {
    try {
        return await scrape();
    } catch (error) {
        console.warn(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        } else {
        console.error('All attempts failed. Throwing error.');
        throw error;
        }
    }
    }
};


const addRecipe = async (data) => {
    const recipe = data.newRecipe;
    const userId = data.user_id;

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
