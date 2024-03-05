const Product = require("../schemas/product.schema")

async function generateProductsMenu(subcategoryID) {
    try {
        const products = await Product.find({subcategory_id: subcategoryID});

        const productOptions = [];
        let group = [];

        products.forEach((product, index) => {
            group.push({ text: product.name, callback_data: `product_${subcategoryID}_${index + 1}` });
            if ((index + 1) % 2 === 0 || index === products.length - 1) {
                productOptions.push(group);
                group = [];
            }
        });

        return productOptions;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [[]]; 
    }
}

async function findProduct(product_id, subcategory_id){
    try{
        const product = await Product.findOne({id: product_id, subcategory_id: subcategory_id});

        return product ? { name: product.name, desc: product.desc, quantity: product.quantity, link: product.link } : null;
        console.log(product.link);
    } catch(error){
        console.error("Error fetching product:", error);
        return null;
    }
}

module.exports = {
    generateProductsMenu,
    findProduct
};
