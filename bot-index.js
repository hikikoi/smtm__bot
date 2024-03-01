require('dotenv').config();
const { Telegraf } = require('telegraf');
const { config } = require('dotenv');
const mongoose = require('mongoose');

config();

mongoose.connect(process.env.MONGOURL)
  .then(() => console.log("Mongoose connected!"))
  .catch(err => console.error(err));

const token = process.env.TOKEN;

const bot = new Telegraf(token);

const { generateCategoriesMenu } = require('./helper/category');
const { generateSubcategoriesMenu } = require('./helper/subcategory');
const { generateProductsMenu, findProduct } = require('./helper/product');
let categoryID = 0;
let subcategoryID = 0;
let productID = 0;

// START

bot.start(async (ctx) => {
  try {
    const categoriesMenu = await generateCategoriesMenu();

    const message = `
    Welcome to our e-store's Telegram bot! 
    
    Explore our wide range of products conveniently right from your chat window. From electronics to fashion, we've got you covered. Enjoy seamless shopping with easy browsing and instant access to great deals. Shop smart, shop with us!
    `;

    ctx.replyWithPhoto({ source: 'images/cover_bot.png' }, {
      caption: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: categoriesMenu
      }
    });
  } catch (error) {
    console.error("Error handling start command:", error);
  }
});

// CATEGORIES 
bot.action(/^category_(\d+)$/, async (ctx) => {
  const match = ctx.match[1];
  categoryID = parseInt(match);

  try {
    const subcategoriesMenu = await generateSubcategoriesMenu(categoryID);
    const message = `Subcategories for Category ${categoryID}`;

    ctx.replyWithPhoto({ source: 'images/cover_bot.png' }, {
      caption: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: subcategoriesMenu
      }
    });
  } catch (error) {
    console.error("Error handling category action:", error);
  }
});

// PRODUCTS

bot.action(/^subcategory_(\d+)$/, async (ctx) => {
  const match = ctx.match[1];
  subcategoryID = parseInt(match);

  try {
    const productsMenu = await generateProductsMenu(subcategoryID);
    const message = `Products`;

    console.log(productsMenu);

    ctx.replyWithPhoto({ source: 'images/cover_bot.png' }, {
      caption: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: productsMenu
      }
    });
  } catch (error) {
    console.error("Error handling category action:", error);
  }
});

// PRODUCT

bot.action(/^product_(\d+)_(\d+)$/, async (ctx) => {
  let subcategoryId = parseInt(ctx.match[1])
  productID = parseInt(ctx.match[2]);

  try {
    const product = await findProduct(productID, subcategoryId);

    if (product) {
      ctx.reply(`Name: ${product.name}\n\nDescription: ${product.desc}\n\nLink: ${product.link}`);
    } else {
      ctx.reply("Product not found.");
    }
  } catch (error) {
    console.error("Error handling product action:", error);
  }
});


bot.launch(console.log("Bot started")).catch(err => console.error(err));
