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
var IPayment_1 = require("../../models/IPayment");
var IUser_1 = require("../../models/IUser");
var format_money_1 = require("../utlis/format_money");
var QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
var secret_key = process.env.secret_key;
var publicKey = process.env.public_key;
var qiwiApi = new QiwiBillPaymentsAPI(secret_key);
function get_link_for_payment(ctx, amount, billID, expirationDateTime) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var params, link;
        return __generator(this, function (_b) {
            try {
                params = {
                    amount: amount.toFixed(2),
                    currency: 'RUB',
                    account: "".concat((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id),
                    expirationDateTime: expirationDateTime,
                    comment: 'На сохранение бурятского яызыка',
                    email: 'alexandrbnimaev@yandex.ru',
                    successUrl: "https://60da-5-136-245-89.eu.ngrok.io/payment/success?billId=".concat(billID)
                };
                link = qiwiApi.createBill(billID, params);
                return [2 /*return*/, link];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
var handler = new telegraf_1.Composer();
var dashboard = new telegraf_1.Scenes.WizardScene("dashboard", handler, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, about_project(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, help_handler(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function greeting(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var user, extra, words, message, _b, _c, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, IUser_1.User.findOne({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id })];
                case 1:
                    user = _d.sent();
                    if (!user) return [3 /*break*/, 8];
                    extra = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'О проекте',
                                        callback_data: 'about'
                                    }
                                ], [
                                    {
                                        text: 'Настройки',
                                        callback_data: 'common_settings'
                                    }
                                ], [
                                    {
                                        text: 'Поддержка проекта',
                                        callback_data: 'help'
                                    }
                                ],
                                [
                                    {
                                        text: 'Справочные материалы',
                                        callback_data: 'reference_materials'
                                    }
                                ],
                                [
                                    {
                                        text: 'Назад',
                                        callback_data: 'home'
                                    },
                                    {
                                        text: 'Обратная связь',
                                        callback_data: 'contact'
                                    }
                                ],
                            ]
                        }
                    };
                    words = [];
                    message = "<b>\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442</b> \n\n";
                    message += "\u041E\u0431\u0449\u0438\u0439 \u0440\u0435\u0439\u0442\u0438\u043D\u0433: ".concat(user.rating, " \n");
                    message += "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u043B\u043E\u0432: 0 \n";
                    message += "\u0421\u043B\u043E\u0432 \u043D\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438: ".concat(words.length, " \n");
                    message += "\u041F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439: 0 \n";
                    message += "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439: ".concat(user.proposedProposals.length);
                    message += "\n\n<b>\u0412\u043D\u0435\u0441\u0435\u043D\u043E \u0432 \u043F\u0440\u043E\u0435\u043A\u0442 ".concat((0, format_money_1["default"])(user.supported), " \u20BD</b>");
                    if (!(ctx.updateType === 'message')) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.reply(message, extra)];
                case 2:
                    _b = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = false;
                    _d.label = 4;
                case 4:
                    _b;
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.editMessageText(message, extra)];
                case 5:
                    _c = _d.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _c = false;
                    _d.label = 7;
                case 7:
                    _c;
                    _d.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _d.sent();
                    console.error(err_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
dashboard.enter(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
dashboard.action("common_settings", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery('Личный кабинет / Настройки')];
            case 1:
                _a.sent();
                return [2 /*return*/, ctx.scene.enter('settings')];
        }
    });
}); });
function about_project(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 4];
                    if (!ctx.callbackQuery) return [3 /*break*/, 3];
                    if (!ctx.callbackQuery.data) return [3 /*break*/, 3];
                    data = ctx.callbackQuery.data;
                    if (!(data === 'back')) return [3 /*break*/, 3];
                    ctx.wizard.selectStep(0);
                    return [4 /*yield*/, ctx.answerCbQuery()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, greeting(ctx)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    about_project_section_render(ctx);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
dashboard.action("about", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, about_project_section_render(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function about_project_section_render(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var message, extra, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    message = '<b>Личный кабинет — О проекте</b> \n\nНаш проект нацелен на развитие бурятского языка, который является важной частью культурного наследия Бурятии. \n\nМы стремимся сохранить и продвигать язык среди молодого поколения, создавая образовательные материалы и организуя языковые мероприятия. \n\nНаша цель - сохранить богатство бурятской культуры и ее языка для будущих поколений.';
                    extra = {
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
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.editMessageText(message, extra)];
                case 1:
                    _a.sent();
                    ctx.answerCbQuery();
                    ctx.wizard.selectStep(1);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, ctx.reply(message, extra)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
handler.on("message", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, greeting(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
dashboard.action('reference_materials', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ctx.answerCbQuery()];
    });
}); });
dashboard.action("help", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, help(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
function help(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var message, extra, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    message = "<b>\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \uD83D\uDCB0</b> \n\n";
                    // await get_link_for_payment(ctx)
                    message += "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0436\u0435\u043B\u0430\u0435\u043C\u0443\u044E \u0441\u0443\u043C\u043C\u0443 \u0432 \u0440\u0443\u0431\u043B\u044F\u0445 \u0434\u043B\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430\n\n";
                    message += "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430: 1 \u20BD\n";
                    message += "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430: 60 000 \u20BD";
                    extra = {
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
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.editMessageText(message, extra)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    ctx.wizard.selectStep(2);
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    console.log(err_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function help_handler(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var message, extra, data, amount, amount_message, currentDate, futureDate, payment, link, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    message = "<b>\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \uD83D\uDCB0</b> \n\n";
                    // await get_link_for_payment(ctx)
                    message += "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0436\u0435\u043B\u0430\u0435\u043C\u0443\u044E \u0441\u0443\u043C\u043C\u0443 \u0432 \u0440\u0443\u0431\u043B\u044F\u0445 \u0434\u043B\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430\n\n";
                    message += "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430: 1 \u20BD\n";
                    message += "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430: 60 000 \u20BD";
                    extra = {
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
                    if (!(ctx.updateType === 'callback_query')) return [3 /*break*/, 2];
                    if (!ctx.callbackQuery.data) return [3 /*break*/, 2];
                    data = ctx.callbackQuery.data;
                    if (!(data === 'back')) return [3 /*break*/, 2];
                    ctx.wizard.selectStep(0);
                    ctx.answerCbQuery();
                    return [4 /*yield*/, greeting(ctx)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(ctx.updateType === 'message')) return [3 /*break*/, 8];
                    amount = 0;
                    // @ts-ignore
                    if (ctx.message.text) {
                        // @ts-ignore
                        if (parseFloat(ctx.message.text) > 0 && parseFloat(ctx.message.text) < 60000) {
                            // @ts-ignore
                            amount = parseFloat(ctx.message.text);
                            // @ts-ignore
                        }
                        else if (parseFloat(ctx.message.text) > 60000) {
                            amount = 60000;
                        }
                    }
                    ctx.scene.session.amount = amount;
                    amount_message = "<b>\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \uD83D\uDCB0</b> \n\n";
                    if (!amount) return [3 /*break*/, 6];
                    currentDate = new Date();
                    futureDate = (currentDate.getTime() + 0.2 * 60 * 60 * 1000);
                    return [4 /*yield*/, new IPayment_1.Payment({
                            user_id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
                            amount: ctx.scene.session.amount,
                            expirationDateTime: futureDate
                        }).save()];
                case 3:
                    payment = _b.sent();
                    console.log(payment);
                    return [4 /*yield*/, get_link_for_payment(ctx, ctx.scene.session.amount, payment._id.toString(), payment.expirationDateTime)];
                case 4:
                    link = _b.sent();
                    amount_message += "\u0421\u0447\u0451\u0442 \u0441\u0444\u043E\u0440\u043C\u0438\u0440\u043E\u0432\u0430\u043D \u043D\u0430 \u0441\u0443\u043C\u043C\u0443 ".concat((0, format_money_1["default"])(ctx.scene.session.amount), " \u20BD\n");
                    return [4 /*yield*/, ctx.reply(amount_message, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Оплатить',
                                            url: link.payUrl
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
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, ctx.reply(message, extra)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_5 = _b.sent();
                    console.log(err_5);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
dashboard.action("home", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ctx.scene.enter('home')];
    });
}); });
dashboard.action("contact", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ctx.answerCbQuery('Обратная связь')];
    });
}); });
exports["default"] = dashboard;
