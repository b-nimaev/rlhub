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
const axios_1 = __importDefault(require("axios"));
const telegraf_1 = require("telegraf");
const handler = new telegraf_1.Composer();
const vocabular = new telegraf_1.Scenes.WizardScene("vocabular", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield translate_word(ctx); }));
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Русский',
                                callback_data: 'russian'
                            },
                            {
                                text: 'Бурятский',
                                callback_data: 'buryat'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'back'
                            }
                        ],
                    ]
                }
            };
            let message = `<b>Словарь</b> \n\nВыберите язык с которого нужно перевести`;
            ctx.updateType === 'message' ? yield ctx.reply(message, extra) : false;
            ctx.updateType === 'callback_query' ? yield ctx.editMessageText(message, extra) : false;
        }
        catch (err) {
            console.log(err);
        }
    });
}
function translate_word(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ctx.updateType === 'callback_query') {
                if (ctx.callbackQuery) {
                    //@ts-ignore
                    if (ctx.callbackQuery.data) {
                        // @ts-ignore
                        let data = ctx.callbackQuery.data;
                        if (data === "back") {
                            ctx.wizard.selectStep(0);
                            yield greeting(ctx);
                        }
                    }
                }
            }
            // @ts-ignore
            if (ctx.message.text) {
                // @ts-ignore
                let word = ctx.message.text;
                let language = ctx.session.language;
                let response = yield axios_1.default.get(`https://burlang.ru/api/v1/${language}/translate?q=${word}`)
                    .then(function (response) {
                    return response.data;
                })
                    .catch(function (error) {
                    return error;
                });
                let message = '';
                if (response.translations) {
                    message = response.translations[0].value;
                }
                else {
                    if (language === 'russian-word') {
                        message = 'Перевод отсутствует';
                    }
                    else {
                        message = 'Уршуулга угы байна..';
                    }
                }
                yield ctx.reply(message, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Назад',
                                    callback_data: 'back'
                                }
                            ]
                        ]
                    }
                });
            }
            else {
                yield ctx.reply("Нужно отправить в текстовом виде");
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
vocabular.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
vocabular.action("back", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery();
    return ctx.scene.enter("home");
}));
vocabular.action("russian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.answerCbQuery();
    ctx.wizard.selectStep(1);
    ctx.session.language = 'russian-word';
    yield render_translate_section(ctx);
}));
vocabular.action("buryat", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.answerCbQuery();
    ctx.wizard.selectStep(1);
    ctx.session.language = 'buryat-word';
    yield render_translate_section(ctx);
}));
function render_translate_section(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = 'Отправьте слово которое нужно перевести';
            yield ctx.editMessageText(message, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'назад',
                                callback_data: 'back'
                            }
                        ]
                    ]
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = vocabular;
