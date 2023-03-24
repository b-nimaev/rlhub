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
exports.add_sentences_handler = void 0;
const telegraf_1 = require("telegraf");
const ISentence_1 = require("../../models/ISentence");
const IUser_1 = require("../../models/IUser");
const handler = new telegraf_1.Composer();
const home = new telegraf_1.Scenes.WizardScene("home", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield add_sentences_handler(ctx); }));
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const extra = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Самоучитель", callback_data: "study" },
                        { text: "Словарь", callback_data: "vocabular" }
                    ],
                    [{ text: 'Предложения', callback_data: 'sentences' }],
                    [{ text: 'Переводчик', callback_data: 'translater' }],
                    [{ text: 'Модерация', callback_data: 'moderation' }],
                    [{ text: "Личный кабинет", callback_data: "dashboard" }]
                ]
            }
        };
        let message = `Самоучитель бурятского языка \n\nКаждое взаимодействие с ботом, \nвлияет на сохранение и дальнейшее развитие <b>Бурятского языка</b>`;
        // message += `\n\nДля оцифровки и создания машинного перевода с любого языка на бурятский и обратно требуется неимоверно <b>много данных</b>`
        // message += `\n\nНаша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка`
        message += '\n\nВыберите раздел, чтобы приступить';
        try {
            ctx.updateType === 'message' ? yield ctx.reply(message, extra) : false;
            ctx.updateType === 'callback_query' ? yield ctx.editMessageText(message, extra) : false;
        }
        catch (err) {
            console.error(err);
        }
    });
}
home.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let document = yield IUser_1.User.findOne({
            id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!document) {
            if (ctx.from) {
                let user = {
                    id: ctx.from.id,
                    username: ctx.from.username,
                    first_name: ctx.from.first_name,
                    translations: [],
                    voted_translations: [],
                    rating: 0,
                    is_bot: false,
                    proposedProposals: [],
                    supported: 0
                };
                new IUser_1.User(user).save();
            }
        }
        else {
            yield greeting(ctx);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
home.action("vocabular", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.answerCbQuery();
    return ctx.scene.enter('vocabular');
}));
home.action("sentences", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.scene.enter('sentences');
}));
home.action("translater", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.answerCbQuery('На стадии разработки 🎯');
}));
home.action("study", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.answerCbQuery('Программа обучения на стадии разработки 🎯');
}));
home.action("moderation", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.answerCbQuery();
    return ctx.scene.enter('moderation');
}));
home.action("dashboard", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery('Личный кабинет');
    return ctx.scene.enter('dashboard');
}));
home.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
home.command('add_sentences', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем');
    ctx.wizard.selectStep(1);
}));
function add_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.from) {
            try {
                if (ctx.updateType === 'callback_query') {
                    if (ctx.callbackQuery) {
                        // @ts-ignore
                        if (ctx.callbackQuery.data) {
                            // @ts-ignore
                            let data = ctx.callbackQuery.data;
                            // сохранение предложенных предложений
                            if (data === 'send_sentences') {
                                for (let i = 0; i < ctx.session.sentences.length; i++) {
                                    let sentence = {
                                        text: ctx.session.sentences[i],
                                        author: ctx.from.id,
                                        accepted: 'not view',
                                        translations: [],
                                        skipped_by: []
                                    };
                                    new ISentence_1.Sentence(sentence).save().then((data) => __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        let object_id = data._id;
                                        yield IUser_1.User.findOneAndUpdate({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { $push: {
                                                "proposedProposals": object_id
                                            } });
                                    }));
                                }
                                yield ctx.answerCbQuery(`${ctx.session.sentences} отправлены на проверку, спасибо!`);
                                ctx.wizard.selectStep(0);
                                yield greeting(ctx);
                            }
                            if (data === 'back') {
                                ctx.wizard.selectStep(0);
                                yield ctx.answerCbQuery();
                                return greeting(ctx);
                            }
                        }
                    }
                }
                else if (ctx.updateType === 'message') {
                    // @ts-ignore
                    if (ctx.message.text) {
                        // @ts-ignore
                        let text = ctx.message.text;
                        let user_id = ctx.from.id;
                        let sentence = {
                            text: text.toLocaleLowerCase(),
                            author: user_id,
                            accepted: 'not view',
                            translations: [],
                            skipped_by: []
                        };
                        let message = ``;
                        if (sentence.text.indexOf('+;') !== -1) {
                            let splitted = sentence.text.split('+;');
                            let arr = [];
                            for (let i = 0; i < splitted.length; i++) {
                                arr.push(splitted[i].trimEnd().trimStart());
                            }
                            ctx.session.sentences = arr;
                            for (let i = 0; i < splitted.length; i++) {
                                message += `${i + 1}) ${splitted[i].trimStart().trimEnd()}\n`;
                            }
                        }
                        else {
                            ctx.session.sentences = [text];
                            message += text;
                        }
                        yield ctx.reply(message, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Сохранить',
                                            callback_data: 'send_sentences'
                                        }
                                    ],
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
            }
            catch (err) {
                ctx.wizard.selectStep(0);
                yield greeting(ctx);
            }
        }
    });
}
exports.add_sentences_handler = add_sentences_handler;
handler.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
exports.default = home;
