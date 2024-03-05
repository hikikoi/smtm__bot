const Subcategory = require("../schemas/subcategory.schema");

async function generateSubcategoriesMenu(categoryID) {
    try {
        const subcategories = await Subcategory.find({category_id: categoryID});

        const subcategoryOptions = [];
        let group = [];

        subcategories.forEach((subcategory, index) => {
            group.push({ text: subcategory.name, callback_data: `subcategory_${index + 1}` });
            subcategoryOptions.push(group);
                group = [];
        });

        return subcategoryOptions;
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return [[]]; 
    }
}

module.exports = {
    generateSubcategoriesMenu
};
