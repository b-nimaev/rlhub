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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.bot = void 0;
require("dotenv/config");
var telegraf_1 = require("telegraf");
var webhook_1 = require("./bot/utlis/webhook");
require("./database");
require("./app");
var fs = require('fs');
var openai = require('openai-api');
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var openaiClient = new openai(OPENAI_API_KEY);
var modelEngine = 'text-davinci-003';
var prompt = 'Дай мне 10 предложений на русском языке в виде массива. Предложения должны быть из литературных произведений.';
function generateSentences(prompt, modelEngine, numSentences) {
    return __awaiter(this, void 0, void 0, function () {
        var sentences, response, text, newSentences;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sentences = [];
                    _a.label = 1;
                case 1:
                    if (!(sentences.length < numSentences)) return [3 /*break*/, 3];
                    return [4 /*yield*/, openaiClient.complete({
                            engine: modelEngine,
                            prompt: prompt,
                            maxTokens: 1024,
                            n: 1,
                            stop: null,
                            temperature: 0.5
                        })];
                case 2:
                    response = _a.sent();
                    console.log(response.data.choices[0]);
                    text = response.data.choices[0].text.trim();
                    newSentences = text.split('. ');
                    sentences = sentences.concat(newSentences);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, sentences.slice(0, numSentences)];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sentences;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateSentences(prompt, modelEngine, 1000)];
                case 1:
                    sentences = _a.sent();
                    fs.writeFileSync('sentences.txt', sentences.join('\n'));
                    return [2 /*return*/];
            }
        });
    });
}
main();
// scenes
var home_scene_1 = require("./bot/views/home.scene");
var sentences_scene_1 = require("./bot/views/sentences.scene");
var settings_scene_1 = require("./bot/views/settings.scene");
var dashboard_scene_1 = require("./bot/views/dashboard.scene");
var vocabular_scene_1 = require("./bot/views/vocabular.scene");
var moderation_scene_1 = require("./bot/views/moderation.scene");
var bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
var stage = new telegraf_1.Scenes.Stage([home_scene_1["default"], vocabular_scene_1["default"], sentences_scene_1["default"], dashboard_scene_1["default"], moderation_scene_1["default"], settings_scene_1["default"]], { "default": 'home' });
(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, webhook_1["default"])()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); })();
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
