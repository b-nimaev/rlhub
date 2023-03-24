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
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const handler = new telegraf_1.Composer();
const moderation = new telegraf_1.Scenes.WizardScene("moderation", handler);
moderation.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Модерация</b>\n\n`;
            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: 'Предложения',
                                callback_data: 'moderation_translates'
                            }
                        ],
                        [{
                                text: 'Переводы',
                                callback_data: 'moderation_sentences'
                            }],
                        [{
                                text: 'Назад',
                                callback_data: 'back'
                            }]
                    ]
                }
            };
            message += `Выберите раздел чтобы приступить`;
            ctx.updateType === 'message' ? yield ctx.reply(message, extra) : false;
            ctx.updateType === 'callback_query' ? yield ctx.editMessageText(message, extra) : false;
        }
        catch (err) {
            console.error(err);
        }
    });
}
moderation.action("moderation_translates", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield moderation_translates(ctx); }));
function moderation_translates(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ctx.updateType === 'callback_query') {
                ctx.answerCbQuery();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function moderation_translates_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        // 👍👎
    });
}
moderation.action("moderation_sentences", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield moderation_sentences(ctx); }));
function moderation_sentences(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Модерация — Предложения</b>`;
            if (ctx.updateType === 'callback_query') {
                ctx.answerCbQuery();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function moderation_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
handler.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
moderation.action("back", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery();
    return ctx.scene.enter("home");
}));
exports.default = moderation;
