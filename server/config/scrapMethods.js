const trimString = function trimString(input) {
    return input.replace(/\r\n|\n|\r/gm, "").replace(/\s+/g, ' ').trim();
}

const getDomain = (url) => {
    const matches = url.match(/^https?:\/\/(?:www\.)?([^\/]+)\/?/i);
    return matches && matches[1];
};

const formatIngredients = ($, data) => {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'h', 'y'];

    data.ingredients = data.ingredients.reduce((result, item, index) => {
        if (index % 2 === 0) {
            let ingredient = item.toLowerCase();
            let quantity = data.ingredients[index + 1];
            let formattedIngredient;

            if (/^[\d\s]+$/.test(quantity)) {
                var ingredientSplit = ingredient.split(' ')
                var firstWord = ingredientSplit[0];
                var lastLetter = firstWord[firstWord.length - 1];

                if (![")", "s", "x"].includes(lastLetter)){
                    formattedIngredient = `${quantity} ${ingredient}s`;
                } else {
                    formattedIngredient = `${quantity} ${ingredient}`;
                }
                
            } else if (vowels.includes(ingredient[0])) {
                formattedIngredient = `${quantity} d'${ingredient}`;
            } else {
                formattedIngredient = `${quantity} de ${ingredient}`;
            }

            result.push(formattedIngredient);
        }
        return result;
    }, []);

    return data;
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

const extractNumbers = input => parseInt((input.match(/\d+/) || [])[0], 10) || null;

const websiteConfig = {
    "cookpad.com": {
        title: { selector: "#recipe h1" },
        imageUrl: { selector:"#recipe_image img", attribute: 'src' },
        persons: { selector: '[id^="serving_recipe_"]'},
        prepTime: {  selector: '[id^="cooking_time_recipe_"]'},
        restTime: {},
        cookTime: {},
        ingredients: { selector: ".ingredient-list li", type: "list"},
        steps: { selector: "#steps p", type: "list"}
    },
    "allrecipes.com": {
        title: { selector: "#article-header--recipe_1-0 h1" },
        imageUrl: { selector:".article-content picture source", attribute: 'srcset' },
        persons: { selector: ".mm-recipes-details__value", index:3},
        prepTime: {  selector: ".mm-recipes-details__value", index:0 },
        restTime: {},
        cookTime: {  selector: ".mm-recipes-details__value", index:1 },
        ingredients: { selector: ".mm-recipes-structured-ingredients__list li p", type: "list"},
        steps: { selector: "#mm-recipes-steps_1-0 p", type: "list"}
    },
    "tudogostoso.com.br": {
        title: { selector: "article.container header .u-title-page" },
        imageUrl: { selector:"article.container .recipe-cover img", attribute: 'src' },
        persons: { selector: "article.container .recipe-section header h2"},
        prepTime: {  selector: "article.container .recipe-info-item", index:0 },
        restTime: {},
        cookTime: {},
        ingredients: { selector: "article.container .recipe-ingredients-item-label", type: "list"},
        steps: { selector: "article.container .recipe-steps-text p", type: "list"}
    },
    "foodnetwork.co.uk": {
        title: { selector: ".h-recipe .container h1" },
        imageUrl: { selector:".h-recipe .container img:nth-of-type(1)", attribute: 'srcset' },
        persons: { selector: ".h-recipe .container .p-2 .p-yield"},
        prepTime: {  selector: ".h-recipe .container .p-2 .dt-duration"},
        restTime: {},
        cookTime: {},
        ingredients: { selector: ".h-recipe .container .p-ingredient", type: "list"},
        steps: { selector: ".h-recipe .container .e-instructions ol li", type: "list"},
        format: ($, data) => {
            if (data.steps.length === 0) {
                data.steps = getListItems($, ".h-recipe .container .e-instructions p", trimString);
            }
            return data;
        }
    },
    "recipetineats.com": {
        title: { selector: ".wprm-recipe-recipe-tin-eats h2" },
        imageUrl: { selector:".wprm-recipe-recipe-tin-eats img", attribute: 'src' },
        persons: { selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-servings-link span"},
        prepTime: {  selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-prep_time-minutes"},
        restTime: {selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-rest_time-minutes"},
        cookTime: {selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-cook_time-minutes"},
        ingredients: { selector: '.wprm-recipe-recipe-tin-eats .wprm-recipe-ingredient', type: "list"},
        steps: { selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-instruction-text", type: "list"},
        format: ($, data) => {
            data.ingredients = data.ingredients.map((element) => {
                return element.replace(/▢ /g, '');
            });
            return data;
        }
    },
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
    "bbcgoodfood.com": {
        title: { selector: ".heading-1" },
        imageUrl: { selector:".image__img", attribute: 'src' },
        persons: { selector: ".recipe__cook-and-prep .icon-with-text__children", index:2},
        prepTime: { selector: ".recipe__cook-and-prep time", index: 0 },
        restTime: { },
        cookTime: { selector: ".recipe__cook-and-prep time", index: 1 },
        ingredients: { selector: ".recipe__ingredients li", type: "list"},
        steps: { selector: ".recipe__method-steps p", type: "list"}
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
        imageUrl: { selector:".recipe_img img", attribute: 'src' },
        persons: { selector: "#LblRecetteNombre"},
        prepTime: { selector: "#trPrepa span"},
        restTime: {},
        cookTime: { selector: "#trCuisson span"},
        ingredients: { selector: ".ingredients ul .ingredient_label, .ingredients ul .js-ingredient-qte.ingredient_qte", type: "list"},
        steps: { selector: ".instructions ul li p", type: "list"},
        format: formatIngredients
    },
    "cuisine.journaldesfemmes.fr": {
        title: { selector: ".app_recipe_title_page" },
        imageUrl: { selector:".bu_cuisine_recette_img img", attribute: 'src' },
        persons: { selector: ".app_recipe_resume span", index:2},
        prepTime: { selector: ".app_recipe_resume span", index:3 },
        restTime: {},
        cookTime: { selector: ".app_recipe_resume span", index:4 },
        ingredients: { selector: ".app_recipe_list span", type: "list"},
        steps: { selector: ".app_recipe_section .bu_cuisine_recette_prepa", type: "list"}, 
        format: formatIngredients
    },
    "simplyrecipes.com": {
        title: { selector: "#heading_1-0 h1" },
        imageUrl: { selector:".article-content video", attribute: 'poster' },
        persons: { selector: "#project-meta_1-0 .meta-text__data", index:3},
        prepTime: {  selector: "#project-meta_1-0 .meta-text__data", index:0 },
        restTime: {},
        cookTime: {  selector: "#project-meta_1-0 .meta-text__data", index:1 },
        ingredients: { selector: ".structured-ingredients__list-item p", type: "list"},
        steps: { selector: "#mntl-sc-block_21-0 p", type: "list"}
    },
    "atelierdeschefs.fr": {
        title: { selector: ".Jumbotron_text__zT_ia h1" },
        imageUrl: { selector:".JumbotronDetails_container_img__NkcAA img", attribute: 'src' },
        persons: { selector: ".css-1dimb5e-singleValue"},
        prepTime: {  selector: ".RecipeTime_text__4_1NJ", index:0},
        restTime: {selector: ".RecipeTime_text__4_1NJ", index:2},
        cookTime: {  selector: ".RecipeTime_text__4_1NJ", index:1},
        ingredients: { selector: ".Line_ingredient_container__E_6Zi span", type: "list"},
        steps: { selector: ".Steps_container__lVB7Z div span div div span", type: "list"},
        format: formatIngredients
    },
    "750g.com": {
        title: { selector: ".u-title-page" },
        imageUrl: { selector:".recipe-cover img", attribute: 'src' },
        persons: { selector: ".ingredient-variator-label"},
        prepTime: { selector: ".recipe-steps-info-item time", index:0},
        restTime: { selector: ".recipe-steps-info-item time", index:2 },
        cookTime: { selector: ".recipe-steps-info time", index:1 },
        ingredients: { selector: ".recipe-ingredients-item-label", type: "list"},
        steps: { selector: ".recipe-steps-text p", type: "list"}
    },
    
};

module.exports = {
    getDomain,
    trimString,
    formatIngredients,
    getText,
    getTextByIndex,
    getAttribute,
    getListItems,
    extractNumbers,
    websiteConfig,
};