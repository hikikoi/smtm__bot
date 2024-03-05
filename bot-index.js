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

bot.start((ctx) => {
  const message = `
SMTM - ваш надежный помощник в поиске товаров и услуг. Наш бот предоставляет быстрый доступ к информации о различных продуктах и сервисах, помогая вам принять правильное решение.

SMTM tovar va xizmatlarni qidirishda ishonchli yordamchingizdir. Bizning botimiz sizga to'g'ri qaror qabul qilishda yordam beradigan turli mahsulot va xizmatlar haqidagi ma'lumotlarga tezkor kirish imkonini beradi.
  `;

  ctx.replyWithPhoto({ source: 'images/cover_bot.png' }, {
    caption: message,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: "Категории | Kategoriyalar", callback_data: "categories" }]]
    }
  });
})

bot.action("categories", async (ctx) => {
  try {
    const categoriesMenu = await generateCategoriesMenu();

    const message = `Категории || Kategoriyalar`;

    ctx.replyWithPhoto({ source: 'images/category.png' }, {
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
    const message = `Подкатегории || Podkategoriyalar`;

    ctx.replyWithPhoto({ source: 'images/subcategory.png' }, {
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
    const message = `Товары || Mahsulotlar`;

    ctx.replyWithPhoto({ source: 'images/products.png' }, {
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
      ctx.reply(`Название || Nomi : \n ${product.name}\n\n Описание || Tavsif : \n ${product.desc}\n\n В наличии || Sotuvda mavjud :\n ${product.quantity == "True" ? "✅" : "❌"}\n\n Ссылка || Link:\n ${product.link}`);
    } else {
      ctx.reply("Продукт не найден || Mahsulot mavjud emas.");
    }
  } catch (error) {
    console.error("Error handling product action:", error);
  }
});


bot.launch(console.log("Bot started")).catch(err => console.error(err));
