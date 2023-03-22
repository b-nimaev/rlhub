"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const telegraf_1 = require("telegraf");
const IUser_1 = require("./models/IUser");
require("./bot/utlis/webhook");
require("./database");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new IUser_1.User({
        telegramId: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
    });
    try {
        yield user.save();
        console.log(`User ${ctx.from.id} saved to database!`);
    }
    catch (err) {
        console.error(err);
    }
    ctx.reply('Hello!');
}));
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
