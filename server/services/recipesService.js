const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer'); // Add Puppeteer
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const pool = require("../databases/database");
const { get } = require('../routes/recipesRoutes');
const scrapMethods = require('../config/scrapMethods');
const { editRecipe } = require('../controllers/recipesController');

// Use the stealth plugin to evade detection
// puppeteer.use(StealthPlugin());

const scrapeRecipe = async (data, retries = 4, delay = 1000) => {
    const url = data;
    const domain = scrapMethods.getDomain(url);
    console.log("Website scrapping: ", domain);
    const config = scrapMethods.websiteConfig[domain];

    if (!url){
        throw new Error("Please provide a url");
    }

    if (!config) {
    throw new Error("This website isn't configured and therefore can't be scrapped.");
    }

    let result = {
    title: null,
    image_url: null,
    persons: null,
    prep_time: null,
    rest_time: null,
    cook_time: null,
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
    try {
        if (config['overlay'] !== undefined) {
            await page.waitForSelector(config['overlay'].buttonSelector, { timeout: 10000 });
            await page.click(config['overlay'].buttonSelector);
            await page.waitForSelector(config['overlay'].selector, { timeout: 10000 });
        }
    } catch (error){}


    const html_data = await page.content();
    await browser.close();
    const $ = cheerio.load(html_data);

    Object.keys(config).forEach(key => {
        try {
        const { selector, index, attribute, type } = config[key];
        if (attribute) {
            result[key] = scrapMethods.getAttribute($, selector, attribute);
        } else if (index !== undefined) {
            result[key] = scrapMethods.getTextByIndex($, selector, index);
        } else if (type === "list") {
            result[key] = scrapMethods.getListItems($, selector, scrapMethods.trimString);
        } else {
            result[key] = scrapMethods.getText($, selector);
        }
        
        } catch (error) {
        console.warn(`Error retrieving ${key}:`, error.message);
        result[key] = null; // Set the value to null if an error occurs
        }
    });

    // Apply additional formatting if defined
    if (config.format) {
        result = config.format($, result);
    }

    if( domain ==="marmiton.org" && !result.image_url){
        try{
            result.image_url = scrapMethods.getAttribute($, "#recipe-media-viewer-main-picture", "data-src")
        } catch (error){}
    }

    result.persons = scrapMethods.extractNumbers(result.persons);

    // Check if data was fetched correctly
    if (result.title === '' && !result.ingredients.length && !result.steps.length && result.source !== '') {
        throw new Error("Data can't be retrieved from the url you provided");
    }

    console.log("image url", result.image_url)

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
    const dateNow = Date.now();
    console.log(recipe)
    // Validate data before inserting
    if (recipe.title === '') {
        throw new Error ('Please provide a title')
    }

    if (recipe.persons === '') {
        throw new Error ('Please provide a number of servings')
    }

    if (recipe.ingredients[0] === 'Add a first ingredient') {
        throw new Error ('Please provide ingredients')
    }

    if (typeof recipe.ingredients !== 'object') {
        throw new Error ('Please validate the ingredients input')
    }

    if (recipe.steps[0] === 'Add a first step') {
        throw new Error ('Please provide steps')
    }

    if (typeof recipe.steps !== 'object') {
        throw new Error ('Please validate the steps input')
    }

    values = [userId, recipe.title, recipe.image_url, recipe.persons, recipe.prep_time, recipe.rest_time, recipe.cook_time, recipe.ingredients, recipe.steps, recipe.source, dateNow]

    const insertSTMT = `INSERT INTO recipesbook (user_id, title, image_url, persons, prep_time, rest_time, cook_time, ingredients, steps, source, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    await pool.query(insertSTMT, values);
}

const editRecipeInDB = async (data) => {
    const recipe = data.recipe;
    const recipe_id = data.recipe.recipe_id;
    const dateNow = Date.now();
    
    // Validate data before inserting
    if (recipe.title === '') {
        throw new Error ('Please provide a title')
    }

    if (recipe.persons === '') {
        throw new Error ('Please provide a number of servings')
    }

    if (recipe.ingredients[0] === 'Add a first ingredient') {
        throw new Error ('Please provide ingredients')
    }

    if (typeof recipe.ingredients !== 'object') {
        throw new Error ('Please validate the ingredients input')
    }

    if (recipe.steps[0] === 'Add a first step') {
        throw new Error ('Please provide steps')
    }

    if (typeof recipe.steps !== 'object') {
        throw new Error ('Please validate the steps input')
    }
    
    // Parameterized query with error handling
    const updateSTMT = `
    UPDATE recipesbook
    SET title = $2,
    image_url = $3,
    persons = $4,
    prep_time = $5,
    cook_time = $6,
    rest_time = $7,
    ingredients = $8,
    steps = $9,
    source = $10,
    created_at = $11
    WHERE recipe_id = $1
    `;

    values = [recipe_id, recipe.title, recipe.image_url, recipe.persons, recipe.prep_time, recipe.rest_time, recipe.cook_time, recipe.ingredients, recipe.steps, recipe.source, dateNow]

    // Execute the query with parameter
    const result = await pool.query(updateSTMT, values);
    };

const deleteRecipe = async (data) => {
    
    const recipeId = data.recipe_id;
    const userId = data.user_id;
    
    const deleteSTMT = `DELETE FROM recipesbook WHERE recipe_id = $1 AND user_id = $2`;
    await pool.query(deleteSTMT, [recipeId, userId]);
}

const userRecipes = async (data) => {
    const userId = data
    
    // Get all the user recipes
    res = await pool.query(`SELECT * FROM recipesbook WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);

    return res.rows;
}



module.exports =  {
    scrapeRecipe,
    addRecipe,
    deleteRecipe,
    userRecipes,
    editRecipeInDB
};
