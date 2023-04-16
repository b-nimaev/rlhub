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
exports.add_sentences_handler = void 0;
var telegraf_1 = require("telegraf");
var ISentence_1 = require("../../models/ISentence");
var IUser_1 = require("../../models/IUser");
var handler = new telegraf_1.Composer();
var home = new telegraf_1.Scenes.WizardScene("home", handler, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, add_sentences_handler(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var extra, message, _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    extra = {
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
                    message = "\u0421\u0430\u043C\u043E\u0443\u0447\u0438\u0442\u0435\u043B\u044C \u0431\u0443\u0440\u044F\u0442\u0441\u043A\u043E\u0433\u043E \u044F\u0437\u044B\u043A\u0430 \n\n\u041A\u0430\u0436\u0434\u043E\u0435 \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0441 \u0431\u043E\u0442\u043E\u043C, \n\u0432\u043B\u0438\u044F\u0435\u0442 \u043D\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0438 \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0435 \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0435 <b>\u0411\u0443\u0440\u044F\u0442\u0441\u043A\u043E\u0433\u043E \u044F\u0437\u044B\u043A\u0430</b>";
                    // message += `\n\nДля оцифровки и создания машинного перевода с любого языка на бурятский и обратно требуется неимоверно <b>много данных</b>`
                    // message += `\n\nНаша цель собрать 100 000 корректных переводов предложений из разных сфер жизни, для создания машинного-бурятского языка`
                    message += '\n\nВыберите раздел, чтобы приступить';
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, , 9]);
                    if (!(ctx.updateType === 'message')) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.reply(message, extra)];
                case 2:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = false;
                    _c.label = 4;
                case 4:
                    _a;
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.editMessageText(message, extra)];
                case 5:
                    _b = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _b = false;
                    _c.label = 7;
                case 7:
                    _b;
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _c.sent();
                    console.error(err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
home.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var document_1, user, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                return [4 /*yield*/, IUser_1.User.findOne({
                        id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                    })];
            case 1:
                document_1 = _b.sent();
                if (!!document_1) return [3 /*break*/, 5];
                if (!ctx.from) return [3 /*break*/, 4];
                user = {
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
                return [4 /*yield*/, new IUser_1.User(user).save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, greeting(ctx)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, greeting(ctx)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
home.action("vocabular", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.answerCbQuery();
        return [2 /*return*/, ctx.scene.enter('vocabular')];
    });
}); });
home.action("sentences", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ctx.scene.enter('sentences')];
    });
}); });
home.action("translater", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ctx.answerCbQuery('На стадии разработки 🎯')];
    });
}); });
home.action("study", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ctx.answerCbQuery('Программа обучения на стадии разработки 🎯')];
    });
}); });
home.action("moderation", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.answerCbQuery();
        return [2 /*return*/, ctx.scene.enter('moderation')];
    });
}); });
home.action("dashboard", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery('Личный кабинет')];
            case 1:
                _a.sent();
                return [2 /*return*/, ctx.scene.enter('dashboard')];
        }
    });
}); });
home.enter(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
home.command('add_sentences', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.reply('Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем')];
            case 1:
                _a.sent();
                ctx.wizard.selectStep(1);
                return [2 /*return*/];
        }
    });
}); });
home.command("reset_activet", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ISentence_1.Sentence.updateMany({
                    active_translator: []
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function add_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var data, i, text, user_id, sentence, message, splitted, arr, i, i, err_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ctx.from) return [3 /*break*/, 14];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 14]);
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 7];
                    if (!ctx.callbackQuery) return [3 /*break*/, 6];
                    if (!ctx.callbackQuery.data) return [3 /*break*/, 6];
                    data = ctx.callbackQuery.data;
                    if (!(data === 'send_sentences')) return [3 /*break*/, 4];
                    for (i = 0; i < ctx.session.sentences.length; i++) {
                        new ISentence_1.Sentence({
                            text: ctx.session.sentences[i],
                            author: ctx.from.id,
                            accepted: 'not view',
                            translations: [],
                            skipped_by: []
                        }).save().then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var object_id;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        object_id = data._id;
                                        return [4 /*yield*/, IUser_1.User.findOneAndUpdate({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { $push: {
                                                    "proposedProposals": object_id
                                                } })];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    return [4 /*yield*/, ctx.answerCbQuery("".concat(ctx.session.sentences, " \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443, \u0441\u043F\u0430\u0441\u0438\u0431\u043E!"))];
                case 2:
                    _a.sent();
                    ctx.wizard.selectStep(0);
                    return [4 /*yield*/, greeting(ctx)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(data === 'back')) return [3 /*break*/, 6];
                    ctx.wizard.selectStep(0);
                    return [4 /*yield*/, ctx.answerCbQuery()];
                case 5:
                    _a.sent();
                    return [2 /*return*/, greeting(ctx)];
                case 6: return [3 /*break*/, 11];
                case 7:
                    if (!(ctx.updateType === 'message')) return [3 /*break*/, 11];
                    if (!ctx.message.text) return [3 /*break*/, 9];
                    text = ctx.message.text;
                    user_id = ctx.from.id;
                    sentence = {
                        text: text.toLocaleLowerCase(),
                        author: user_id,
                        accepted: 'not view',
                        translations: [],
                        skipped_by: [],
                        active_translator: []
                    };
                    message = "";
                    if (sentence.text.indexOf('+;') !== -1) {
                        splitted = sentence.text.split('+;');
                        arr = [];
                        for (i = 0; i < splitted.length; i++) {
                            arr.push(splitted[i].trimEnd().trimStart());
                        }
                        ctx.session.sentences = arr;
                        for (i = 0; i < splitted.length; i++) {
                            message += "".concat(i + 1, ") ").concat(splitted[i].trimStart().trimEnd(), "\n");
                        }
                    }
                    else {
                        ctx.session.sentences = [text];
                        message += text;
                    }
                    return [4 /*yield*/, ctx.reply(message, {
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
                        })];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, ctx.reply("Нужно отправить в текстовом виде")];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11: return [3 /*break*/, 14];
                case 12:
                    err_3 = _a.sent();
                    ctx.wizard.selectStep(0);
                    return [4 /*yield*/, greeting(ctx)];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.add_sentences_handler = add_sentences_handler;
handler.on("message", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
exports["default"] = home;
