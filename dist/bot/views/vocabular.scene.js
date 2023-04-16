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
var axios_1 = require("axios");
var telegraf_1 = require("telegraf");
var handler = new telegraf_1.Composer();
var vocabular = new telegraf_1.Scenes.WizardScene("vocabular", handler, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, translate_word(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var extra, message, _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 7, , 8]);
                    extra = {
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
                    message = "<b>\u0421\u043B\u043E\u0432\u0430\u0440\u044C</b> \n\n\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A \u0441 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043D\u0443\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u0432\u0435\u0441\u0442\u0438";
                    if (!(ctx.updateType === 'message')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.reply(message, extra)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = false;
                    _c.label = 3;
                case 3:
                    _a;
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.editMessageText(message, extra)];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = false;
                    _c.label = 6;
                case 6:
                    _b;
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _c.sent();
                    console.log(err_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function translate_word(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var data, word, language, response, message, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 2];
                    if (!ctx.callbackQuery) return [3 /*break*/, 2];
                    if (!ctx.callbackQuery.data) return [3 /*break*/, 2];
                    data = ctx.callbackQuery.data;
                    if (!(data === "back")) return [3 /*break*/, 2];
                    ctx.wizard.selectStep(0);
                    return [4 /*yield*/, greeting(ctx)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!ctx.message.text) return [3 /*break*/, 5];
                    word = ctx.message.text;
                    language = ctx.session.language;
                    return [4 /*yield*/, axios_1["default"].get("https://burlang.ru/api/v1/".concat(language, "/translate?q=").concat(word))
                            .then(function (response) {
                            return response.data;
                        })["catch"](function (error) {
                            return error;
                        })];
                case 3:
                    response = _a.sent();
                    message = '';
                    if (response.translations) {
                        message = response.translations[0].value;
                    }
                    else {
                        if (language === 'russian-word') {
                            message = 'Перевод отсутствует';
                        }
                        else {
                            message = 'Оршуулга угы байна..';
                        }
                    }
                    return [4 /*yield*/, ctx.reply(message, {
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
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, ctx.reply("Нужно отправить в текстовом виде")];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
vocabular.enter(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
vocabular.action("back", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery()];
            case 1:
                _a.sent();
                return [2 /*return*/, ctx.scene.enter("home")];
        }
    });
}); });
vocabular.action("russian", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.answerCbQuery();
                ctx.wizard.selectStep(1);
                ctx.session.language = 'russian-word';
                return [4 /*yield*/, render_translate_section(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
vocabular.action("buryat", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.answerCbQuery();
                ctx.wizard.selectStep(1);
                ctx.session.language = 'buryat-word';
                return [4 /*yield*/, render_translate_section(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function render_translate_section(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var message, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    message = 'Отправьте слово которое нужно перевести';
                    return [4 /*yield*/, ctx.editMessageText(message, {
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
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = vocabular;
