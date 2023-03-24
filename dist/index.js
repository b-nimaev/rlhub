"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
require("dotenv/config");
const telegraf_1 = require("telegraf");
require("./bot/utlis/webhook");
require("./database");
require("./app");
// scenes
const home_scene_1 = __importDefault(require("./bot/views/home.scene"));
const sentences_scene_1 = __importDefault(require("./bot/views/sentences.scene"));
const settings_scene_1 = __importDefault(require("./bot/views/settings.scene"));
const dashboard_scene_1 = __importDefault(require("./bot/views/dashboard.scene"));
const vocabular_scene_1 = __importDefault(require("./bot/views/vocabular.scene"));
const moderation_scene_1 = __importDefault(require("./bot/views/moderation.scene"));
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
const stage = new telegraf_1.Scenes.Stage([home_scene_1.default, vocabular_scene_1.default, sentences_scene_1.default, dashboard_scene_1.default, moderation_scene_1.default, settings_scene_1.default], { default: 'home' });
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
