const { generateCategoriesMenu } = require("../helper/category")

let main = [[]]

generateCategoriesMenu().then(categoriesMenu => {
    main = categoriesMenu;
    module.exports = { main }; // Export 'main' after it's populated
    console.log("Main populated:", main);
}).catch(error => {
    console.error("Error generating categories menu:", error);
});
