require('dotenv').config();
const { Telegraf } = require('telegraf');
const keyboard = require('./keyboards/keyboard');
const { config } = require('dotenv');
const mongoose = require('mongoose');

config();

mongoose.connect(process.env.MONGOURL)
  .then(() => console.log("Mongoose connected!"))
  .catch(err => console.error(err));

const token = process.env.TOKEN;

const bot = new Telegraf(token);

// Import the function that generates categories menu
const { generateCategoriesMenu } = require('./helper/category');

// START
bot.start(async (ctx) => {
  try {
    // Generate categories menu and wait for it to be populated
    const categoriesMenu = await generateCategoriesMenu();

    // Log the populated menu for debugging
    console.log(categoriesMenu);

    const message = `
    Welcome to our e-store's Telegram bot! 
    
    Explore our wide range of products conveniently right from your chat window. From electronics to fashion, we've got you covered. Enjoy seamless shopping with easy browsing and instant access to great deals. Shop smart, shop with us!
    `;

    // Reply with photo and categories menu
    ctx.replyWithPhoto({ source: 'images/cover_bot.png' }, {
      caption: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: categoriesMenu // Use the populated categories menu
      }
    });
  } catch (error) {
    console.error("Error handling start command:", error);
  }
});

// Start the bot
bot.launch().then(() => console.log("Bot started")).catch(err => console.error(err));
