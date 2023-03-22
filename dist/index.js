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
require("./bot/utlis/webhook");
require("./database");
// scenes
const home_scene_1 = __importDefault(require("./bot/views/home.scene"));
const settings_scene_1 = __importDefault(require("./bot/views/settings.scene"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
const stage = new telegraf_1.Scenes.Stage([home_scene_1.default, settings_scene_1.default], { default: 'home' });
bot.use(stage.middleware());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
