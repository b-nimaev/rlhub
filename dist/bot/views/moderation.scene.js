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
var telegraf_1 = require("telegraf");
var ISentence_1 = require("../../models/ISentence");
var handler = new telegraf_1.Composer();
var moderation = new telegraf_1.Scenes.WizardScene("moderation", handler);
moderation.enter(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var message, extra, _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 7, , 8]);
                    message = "<b>\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F</b>\n\n";
                    extra = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: 'Предложения',
                                        callback_data: 'moderation_sentences'
                                    }],
                                [{
                                        text: 'Переводы',
                                        callback_data: 'moderation_translates'
                                    }
                                ],
                                [{
                                        text: 'Назад',
                                        callback_data: 'back'
                                    }]
                            ]
                        }
                    };
                    message += "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u0441\u0442\u0443\u043F\u0438\u0442\u044C";
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
                    console.error(err_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
moderation.action("moderation_translates", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, moderation_translates(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function moderation_translates(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                if (ctx.updateType === 'callback_query') {
                    ctx.answerCbQuery();
                }
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function moderation_translates_handler(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
moderation.action("moderation_sentences", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, moderation_sentences(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function moderation_sentences(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var message;
        var _this = this;
        return __generator(this, function (_a) {
            try {
                message = "<b>\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F \u2014 \u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F</b>";
                if (ctx.updateType === 'callback_query') {
                    ISentence_1.Sentence.find({
                        accepted: "not view"
                    }).then(function (documents) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (documents) {
                                if (documents.length) {
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    ctx.answerCbQuery();
                }
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
function moderation_sentences_handler(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
handler.on("message", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
moderation.action("back", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery()];
            case 1:
                _a.sent();
                return [2 /*return*/, ctx.scene.enter("home")];
        }
    });
}); });
exports["default"] = moderation;
