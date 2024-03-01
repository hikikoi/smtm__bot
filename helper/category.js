const Category = require("../schemas/category.schema");

async function generateCategoriesMenu() {
    try {
        const categories = await Category.find().select('name').exec();

        const categoryOptions = [];
        let group = [];

        categories.forEach((category, index) => {
            group.push({ text: category.name, callback_data: `category_${index + 1}` });
            if ((index + 1) % 2 === 0 || index === categories.length - 1) {
                categoryOptions.push(group);
                group = [];
            }
        });

        return categoryOptions;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [[]]; 
    }
}

module.exports = {
    generateCategoriesMenu
};
