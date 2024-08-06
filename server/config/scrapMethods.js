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
        image_url: { selector:"#recipe_image img", attribute: 'src' },
        persons: { selector: '[id^="serving_recipe_"]'},
        prep_time: {  selector: '[id^="cooking_time_recipe_"]'},
        rest_time: {},
        cook_time: {},
        ingredients: { selector: ".ingredient-list li", type: "list"},
        steps: { selector: "#steps p", type: "list"}
    },
    "allrecipes.com": {
        title: { selector: "#article-header--recipe_1-0 h1" },
        image_url: { selector:".primary-image__media img", attribute: 'src' },
        persons: { selector: ".mm-recipes-details__value", index:3},
        prep_time: {  selector: ".mm-recipes-details__value", index:0 },
        rest_time: {},
        cook_time: {  selector: ".mm-recipes-details__value", index:1 },
        ingredients: { selector: ".mm-recipes-structured-ingredients__list li p", type: "list"},
        steps: { selector: "#mm-recipes-steps_1-0 p", type: "list"}
    },
    "tudogostoso.com.br": {
        title: { selector: "article.container header .u-title-page" },
        image_url: { selector:"article.container .recipe-cover img", attribute: 'src' },
        persons: { selector: "article.container .recipe-section header h2"},
        prep_time: {  selector: "article.container .recipe-info-item", index:0 },
        rest_time: {},
        cook_time: {},
        ingredients: { selector: "article.container .recipe-ingredients-item-label", type: "list"},
        steps: { selector: "article.container .recipe-steps-text p", type: "list"}
    },
    "foodnetwork.co.uk": {
        title: { selector: ".h-recipe .container h1" },
        image_url: { selector:".h-recipe .container img:nth-of-type(1)", attribute: 'srcset' },
        persons: { selector: ".h-recipe .container .p-2 .p-yield"},
        prep_time: {  selector: ".h-recipe .container .p-2 .dt-duration"},
        rest_time: {},
        cook_time: {},
        ingredients: { selector: ".h-recipe .container .p-ingredient", type: "list"},
        steps: { selector: ".h-recipe .container .e-instructions ol li", type: "list"},
        format: ($, data) => {
            if (data.steps.length === 0) {
                data.steps = getListItems($, ".h-recipe .container .e-instructions p", trimString);
            }
            data.image_url = data.image_url.split(' ')[0];
            return data;
        }
    },
    "recipetineats.com": {
        title: { selector: ".wprm-recipe-recipe-tin-eats h2" },
        image_url: { selector:".wp-block-image img", attribute: 'src' },
        persons: { selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-servings-link span"},
        prep_time: {  selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-prep_time-minutes"},
        rest_time: {selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-rest_time-minutes"},
        cook_time: {selector: ".wprm-recipe-recipe-tin-eats .wprm-recipe-cook_time-minutes"},
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
        image_url: { selector:".af_diapo__img-container img", attribute:"src"},
        persons: { selector: ".recipe-ingredients__qt-counter__value_container input", attribute:'value' },
        prep_time: { selector: ".recipe-preparation__time .time__details div div", index: 0 },
        rest_time: { selector: ".recipe-preparation__time .time__details div div", index: 1 },
        cook_time: { selector: ".recipe-preparation__time .time__details div div", index: 2 },
        ingredients: { selector: ".card-ingredient-title", type: "list"},
        steps: { selector: ".recipe-step-list p", type: "list"},
        cookies:{state: true, selector:'button#didomi-notice-agree-button'},
        overlay:{state:true, buttonSelector:'.recipe-media-viewer-thumbnail-container img', selector:'.af_diapo__img-container img'}
    },
    "bbcgoodfood.com": {
        title: { selector: ".heading-1" },
        image_url: { selector:".post-header-image .image__container .image__img", attribute: 'src' },
        persons: { selector: ".recipe__cook-and-prep .icon-with-text__children", index:2},
        prep_time: { selector: ".recipe__cook-and-prep time", index: 0 },
        rest_time: { },
        cook_time: { selector: ".recipe__cook-and-prep time", index: 1 },
        ingredients: { selector: ".recipe__ingredients li", type: "list"},
        steps: { selector: ".recipe__method-steps p", type: "list"}
    },
    "elle.fr": {
        title: { selector: ".article__title" },
        image_url: { selector:".article__picture img", attribute: 'src' },
        persons: { selector: ".article__detail-value", index:0},
        prep_time: { selector: ".article__detail-value", index:1 },
        rest_time: {},
        cook_time: {},
        ingredients: { selector: "ul.article-body__list li", type: "list"},
        steps: { selector: "ol.article-body__list p", type: "list"}
    },
    "cuisineaz.com": {
        title: { selector: ".recipe-title" },
        image_url: { selector:".recipe_img img", attribute: 'src' },
        persons: { selector: "#LblRecetteNombre"},
        prep_time: { selector: "#trPrepa span"},
        rest_time: {},
        cook_time: { selector: "#trCuisson span"},
        ingredients: { selector: ".ingredients ul .ingredient_label, .ingredients ul .js-ingredient-qte.ingredient_qte", type: "list"},
        steps: { selector: ".instructions ul li p", type: "list"},
        format: formatIngredients
    },
    "cuisine.journaldesfemmes.fr": {
        title: { selector: ".app_recipe_title_page" },
        image_url: { selector:".bu_cuisine_recette_img img", attribute: 'src' },
        persons: { selector: ".app_recipe_resume span", index:2},
        prep_time: { selector: ".app_recipe_resume span", index:3 },
        rest_time: {},
        cook_time: { selector: ".app_recipe_resume span", index:4 },
        ingredients: { selector: ".app_recipe_list span", type: "list"},
        steps: { selector: ".app_recipe_section .bu_cuisine_recette_prepa", type: "list"}, 
        format: ($, data) => {
            formatIngredients($, data);
            
            data.prep_time = data.prep_time.replace("Préparation ", "");
            data.cook_time = data.cook_time.replace("Cuisson ", "");
            return(data)
        }
    },
    "simplyrecipes.com": {
        title: { selector: "#heading_1-0 h1" },
        image_url: { selector:".primary-image__media img", attribute: 'src' },
        persons: { selector: "#project-meta_1-0 .meta-text__data", index:3},
        prep_time: {  selector: "#project-meta_1-0 .meta-text__data", index:0 },
        rest_time: {},
        cook_time: {  selector: "#project-meta_1-0 .meta-text__data", index:1 },
        ingredients: { selector: ".structured-ingredients__list-item p", type: "list"},
        steps: { selector: ".section--instructions ol li p", type: "list"}
    },
    "atelierdeschefs.fr": {
        title: { selector: ".Jumbotron_text__zT_ia h1" },
        image_url: { selector:".JumbotronDetails_container_img__NkcAA img", attribute: 'src' },
        persons: { selector: ".css-1dimb5e-singleValue"},
        prep_time: {  selector: ".RecipeTime_text__4_1NJ", index:0},
        rest_time: {selector: ".RecipeTime_text__4_1NJ", index:2},
        cook_time: {  selector: ".RecipeTime_text__4_1NJ", index:1},
        ingredients: { selector: ".Line_ingredient_container__E_6Zi span", type: "list"},
        steps: { selector: ".Steps_container__lVB7Z div span div div span", type: "list"},
        format: formatIngredients
    },
    "750g.com": {
        title: { selector: ".u-title-page" },
        image_url: { selector:".recipe-cover source", attribute: 'srcset' },
        persons: { selector: ".ingredient-variator-label"},
        prep_time: { selector: ".recipe-steps-info-item time", index:0},
        rest_time: { selector: ".recipe-steps-info-item time", index:2 },
        cook_time: { selector: ".recipe-steps-info time", index:1 },
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