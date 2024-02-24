const Category = require("../schemas/category.schema");

async function generateCategoriesMenu() {
    try {
        const categories = await Category.find().select('name').exec();

        const categoryOptions = categories.map((category, index) => {
            return { text: category.name, callback_data: `category_${index + 1}` };
        });

        return [categoryOptions];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [[]]; 
    }
}

module.exports = {
    generateCategoriesMenu
};
