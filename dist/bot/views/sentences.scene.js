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
const mongodb_1 = require("mongodb");
const telegraf_1 = require("telegraf");
const ISentence_1 = require("../../models/ISentence");
const IUser_1 = require("../../models/IUser");
const format_money_1 = __importDefault(require("../utlis/format_money"));
const handler = new telegraf_1.Composer();
const sentences = new telegraf_1.Scenes.WizardScene("sentences", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield my_sentences_handler(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield add_sentences_handler(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield translate_sentences_handler(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield add_translate_to_sentences_hander(ctx); }));
// при входе
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Добавить перевод',
                                callback_data: 'translate_sentences'
                            }
                        ],
                        [
                            {
                                text: 'Предложения',
                                callback_data: 'add_sentence'
                            }
                        ], [
                            {
                                text: 'Статистика',
                                callback_data: 'my_sentences'
                            }
                        ],
                        [
                            {
                                text: 'Назад',
                                callback_data: 'home'
                            }
                        ],
                    ]
                }
            };
            let sentences = yield ISentence_1.Sentence.find({});
            let left = 100000 - sentences.length;
            let message = `<b>Перевод предложений 🚀</b> \n\n`;
            message += `Наша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка\n\n`;
            message += `А Чтобы переводить предложения, нужны сами предложения на <b>русском языке</b>. \n\nДо конца цели осталось <b>${(0, format_money_1.default)(left)}</b>x`;
            ctx.updateType === 'message' ? yield ctx.reply(message, extra) : false;
            ctx.updateType === 'callback_query' ? yield ctx.editMessageText(message, extra) : false;
        }
        catch (err) {
            console.error(err);
        }
    });
}
sentences.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
// статистика
sentences.action('my_sentences', (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield my_sentences(ctx); }));
function my_sentences(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Статистика</b> \n\n`;
            let extra = {
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
            };
            message += `Здесь будут отображаться ваша статисика по работе с предложениями\n\n`;
            let user = yield IUser_1.User.findOne({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
            let props_obj = {
                accepted: [],
                declined: [],
                not_view: []
            };
            if (user) {
                let props = user.proposedProposals;
                for (let i = 0; i < props.length; i++) {
                    let sentence = yield ISentence_1.Sentence.findOne({ _id: new mongodb_1.ObjectId(props[i]) });
                    if (sentence) {
                        if (sentence.accepted === 'accepted') {
                            props_obj.accepted.push(sentence);
                        }
                        if (sentence.accepted === 'declined') {
                            props_obj.declined.push(sentence);
                        }
                        if (sentence.accepted === 'not view') {
                            props_obj.not_view.push(sentence);
                        }
                    }
                }
            }
            message += `Отправлено предложений: ${props_obj.not_view.length + props_obj.accepted.length + props_obj.declined.length}\n`;
            message += `Принято предложений: ${props_obj.accepted.length}\n`;
            message += `Отклонено предложений: ${props_obj.declined.length}\n`;
            message += `Предложений на рассмотрении: ${props_obj.not_view.length}`;
            if (ctx.updateType === 'callback_query') {
                ctx.answerCbQuery();
                yield ctx.editMessageText(message, extra);
            }
            else {
                yield ctx.reply(message, extra);
            }
            ctx.wizard.selectStep(1);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function my_sentences_handler(ctx) {
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
            else {
                yield my_sentences(ctx);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
// перевод предложений
sentences.action("translate_sentences", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield translate_sentences(ctx); }));
function translate_sentences(ctx) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = '<b>Добавление перевода 🎯</b>\n\n';
            message += 'Я буду давать предложение за предложением для перевода, можно заполнять данные без остановки.\n\n';
            message += `Несколько важных правил:\n`;
            message += `— Переводим слово в слово\n`;
            message += `— Используем минимум ород угэнуудые \n`;
            message += `— Всё предложением пишем на кириллице \n`;
            message += `— Не забываем про знаки препинания \n\n`;
            message += `— Буквы отсутствующие в кириллице — <code>һ</code>, <code>ү</code>, <code>өө</code>, копируем из предложенных. \n❗️При клике на них, скопируется нужная буква \n\n`;
            message += `<b>И помните, чем качественнее перевод — тем дольше проживет язык</b>`;
            let extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: []
                }
            };
            (_a = extra.reply_markup) === null || _a === void 0 ? void 0 : _a.inline_keyboard.push([{
                    text: 'Начать',
                    callback_data: 'start'
                }]);
            yield ISentence_1.Sentence.find({ skipped_by: { $in: [(_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id] } }).then((docs) => __awaiter(this, void 0, void 0, function* () {
                var _d;
                if (docs.length > 0) {
                    (_d = extra.reply_markup) === null || _d === void 0 ? void 0 : _d.inline_keyboard.push([{
                            text: `Сброс skipped(${docs.length})`,
                            callback_data: 'reset_skipped'
                        }]);
                }
            }));
            (_c = extra.reply_markup) === null || _c === void 0 ? void 0 : _c.inline_keyboard.push([{
                    text: 'Назад',
                    callback_data: 'back'
                }]);
            if (ctx.updateType === 'callback_query') {
                yield ctx.editMessageText(message, extra);
            }
            else {
                yield ctx.reply(message, extra);
            }
            ctx.wizard.selectStep(3);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function render_sentencse_for_translate(ctx, sentence) {
    return __awaiter(this, void 0, void 0, function* () {
        let message = '';
        // @ts-ignore
        ctx.scene.session.sentence_id = sentence === null || sentence === void 0 ? void 0 : sentence._id.toString();
        message += `Отправьте перевод предложения: \n`;
        message += `<code>${sentence === null || sentence === void 0 ? void 0 : sentence.text}</code>`;
        message += `\n\n— Буквы отсутствующие в кириллице — <code>һ</code>, <code>ү</code>, <code>өө</code>, копируем из предложенных.`;
        if (sentence === null || sentence === void 0 ? void 0 : sentence.translations.length) {
            message += `\n\n<i>Существующие переводы:</i>`;
            for (let i = 0; i < sentence.translations.length; i++) {
                let translation = yield ISentence_1.Translation.findOne({
                    _id: new mongodb_1.ObjectId(sentence.translations[i])
                });
                if (translation) {
                    message += `\n${i + 1}) ${translation.translate_text}`;
                }
            }
        }
        // тут вывести переводы
        ctx.wizard.selectStep(4);
        return message;
    });
}
function render_sft(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Перевод предложений</b>\n\n`;
            let extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Пропустить',
                                callback_data: 'skip'
                            },
                            {
                                text: 'Назад',
                                callback_data: 'back'
                            }
                        ]
                    ]
                }
            };
            let sentence = yield ISentence_1.Sentence.findOne({
                skipped_by: {
                    $ne: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                }
            }).sort({ 'translations.length': 1 });
            if (sentence) {
                yield render_sentencse_for_translate(ctx, sentence).then((response) => {
                    message += response;
                });
            }
            else {
                message += `Предложений не найдено`;
            }
            if (ctx.updateType === 'callback_query') {
                ctx.answerCbQuery();
                return yield ctx.editMessageText(message, extra);
            }
            else {
                return yield ctx.reply(message, extra);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function reset_skipped(ctx) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ISentence_1.Sentence.updateMany({
                skipped_by: { $in: [(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id] }
            }, {
                $pull: {
                    skipped_by: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id
                }
            }).then(() => __awaiter(this, void 0, void 0, function* () {
                ctx.answerCbQuery('Пропущенные слова сброшены');
            })).catch(() => __awaiter(this, void 0, void 0, function* () {
                ctx.answerCbQuery('Возникла ошибка');
            }));
        }
        catch (err) {
            console.log(err);
        }
    });
}
function translate_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.from) {
            try {
                if (ctx.updateType === 'callback_query') {
                    // @ts-ignore
                    if (ctx.callbackQuery.data) {
                        // @ts-ignore
                        let data = ctx.callbackQuery.data;
                        if (data === 'back') {
                            yield greeting(ctx);
                            ctx.wizard.selectStep(0);
                        }
                        if (data === 'start') {
                            yield render_sft(ctx);
                        }
                        if (data === 'reset_skipped') {
                            yield reset_skipped(ctx);
                            yield translate_sentences(ctx);
                        }
                    }
                }
                else {
                    yield translate_sentences(ctx);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
// добавление перевода предложения
function add_translate_to_sentences_hander(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.from) {
            try {
                if (ctx.updateType === 'callback_query') {
                    // @ts-ignore
                    if (ctx.callbackQuery.data) {
                        // @ts-ignore
                        let data = ctx.callbackQuery.data;
                        if (data === 'back') {
                            yield translate_sentences(ctx);
                        }
                        if (data === 'skip') {
                            yield ISentence_1.Sentence.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(ctx.session.__scenes.sentence_id)
                            }, {
                                $push: {
                                    skipped_by: ctx.from.id
                                }
                            }).then(() => __awaiter(this, void 0, void 0, function* () {
                                yield render_sft(ctx);
                            }));
                            ctx.answerCbQuery();
                        }
                    }
                }
                if (ctx.updateType === 'message') {
                    // @ts-ignore
                    if (ctx.message.text) {
                        // @ts-ignore
                        let text = ctx.message.text;
                        let user_id = ctx.from.id;
                        let translation = {
                            sentence_russian: ctx.scene.session.sentence_id,
                            translate_text: text,
                            author: user_id,
                            votes: []
                        };
                        new ISentence_1.Translation(translation).save().then((document) => __awaiter(this, void 0, void 0, function* () {
                            yield ISentence_1.Sentence.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(ctx.scene.session.sentence_id)
                            }, {
                                $push: {
                                    translations: document._id.toString()
                                }
                            });
                        }));
                    }
                    else {
                        yield ctx.reply("Нужно отправить в текстовом виде");
                        yield render_sft(ctx);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
function add_translate_to_sentences(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (err) {
            console.log(err);
        }
    });
}
// добавление предложений
sentences.action("add_sentence", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield add_sentences(ctx); }));
function add_sentences(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.answerCbQuery();
        ctx.wizard.selectStep(2);
        let message = `<b>Добавление перевода — Предложения</b>\n\n`;
        message += `Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем`;
        yield ctx.editMessageText(message, {
            parse_mode: 'HTML', reply_markup: {
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
    });
}
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
                                        translations: [],
                                        accepted: 'not view',
                                        skipped_by: []
                                    };
                                    new ISentence_1.Sentence(sentence).save().then((data) => __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        let object_id = data._id;
                                        yield IUser_1.User.findOneAndUpdate({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, {
                                            $push: {
                                                "proposedProposals": object_id
                                            }
                                        });
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
                            translations: [],
                            accepted: 'not view',
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
// переход на главную
sentences.action("home", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.answerCbQuery();
    ctx.scene.enter('home');
}));
// обработка входящих на сцене
handler.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
exports.default = sentences;
