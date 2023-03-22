"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const telegraf_1 = require("telegraf");
const webhook_1 = require("./bot/utlis/webhook");
const fetch = require('node-fetch');
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
bot.start((ctx) => {
    ctx.reply('Hello!');
});
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
(0, webhook_1.set_webhook)();
