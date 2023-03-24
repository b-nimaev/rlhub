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
const telegraf_1 = require("telegraf");
const IPayment_1 = require("../../models/IPayment");
const IUser_1 = require("../../models/IUser");
const format_money_1 = __importDefault(require("../utlis/format_money"));
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const secret_key = process.env.secret_key;
const publicKey = process.env.public_key;
const qiwiApi = new QiwiBillPaymentsAPI(secret_key);
function get_link_for_payment(ctx, amount, billID, expirationDateTime) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = {
                amount: amount.toFixed(2),
                currency: 'RUB',
                account: `${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id}`,
                expirationDateTime: expirationDateTime,
                comment: 'На сохранение бурятского яызыка',
                email: 'alexandrbnimaev@yandex.ru',
                successUrl: `https://60da-5-136-245-89.eu.ngrok.io/payment/success?billId=${billID}`
            };
            let link = qiwiApi.createBill(billID, params);
            return link;
        }
        catch (err) {
            console.log(err);
        }
    });
}
const handler = new telegraf_1.Composer();
const dashboard = new telegraf_1.Scenes.WizardScene("dashboard", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield about_project(ctx); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield help_handler(ctx); }));
function greeting(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield IUser_1.User.findOne({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id });
            if (user) {
                const extra = {
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
                let words = [];
                let message = `<b>Личный кабинет</b> \n\nОбщий рейтинг: ${user.rating} \nДобавлено слов: 0 \nСлов на модерации: ${words.length} \nПереведено предложений: 0 \nДобавлено предложений: ${user.proposedProposals.length}`;
                message += `\n\n<b>Внесено в проект ${(0, format_money_1.default)(user.supported)} ₽</b>`;
                ctx.updateType === 'message' ? yield ctx.reply(message, extra) : false;
                ctx.updateType === 'callback_query' ? yield ctx.editMessageText(message, extra) : false;
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
dashboard.enter((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
dashboard.action("common_settings", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery('Личный кабинет / Настройки');
    return ctx.scene.enter('settings');
}));
function about_project(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ctx.updateType === 'callback_query') {
                if (ctx.callbackQuery) {
                    // @ts-ignore
                    if (ctx.callbackQuery.data) {
                        // @ts-ignore
                        let data = ctx.callbackQuery.data;
                        if (data === 'back') {
                            ctx.wizard.selectStep(0);
                            yield ctx.answerCbQuery();
                            yield greeting(ctx);
                        }
                    }
                }
            }
            else {
                about_project_section_render(ctx);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
dashboard.action("about", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield about_project_section_render(ctx); }));
function about_project_section_render(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = '<b>Личный кабинет — О проекте</b> \n\nНаш проект нацелен на развитие бурятского языка, который является важной частью культурного наследия Бурятии. \n\nМы стремимся сохранить и продвигать язык среди молодого поколения, создавая образовательные материалы и организуя языковые мероприятия. \n\nНаша цель - сохранить богатство бурятской культуры и ее языка для будущих поколений.';
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
            if (ctx.updateType === 'callback_query') {
                yield ctx.editMessageText(message, extra);
                ctx.answerCbQuery();
                ctx.wizard.selectStep(1);
            }
            else {
                yield ctx.reply(message, extra);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
handler.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield greeting(ctx); }));
dashboard.action('reference_materials', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.answerCbQuery();
}));
dashboard.action("help", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield help(ctx); }));
function help(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Поддержка проекта 💰</b> \n\n`;
            // await get_link_for_payment(ctx)
            message += `Введите желаемую сумму в рублях для поддержки проекта\n\n`;
            message += `Минимальная сумма: 1 ₽\n`;
            message += `Максимальная сумма: 60 000 ₽`;
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
            if (ctx.updateType === 'callback_query') {
                yield ctx.editMessageText(message, extra);
            }
            ctx.wizard.selectStep(2);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function help_handler(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `<b>Поддержка проекта 💰</b> \n\n`;
            // await get_link_for_payment(ctx)
            message += `Введите желаемую сумму в рублях для поддержки проекта\n\n`;
            message += `Минимальная сумма: 1 ₽\n`;
            message += `Максимальная сумма: 60 000 ₽`;
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
            if (ctx.updateType === 'callback_query') {
                // @ts-ignore
                if (ctx.callbackQuery.data) {
                    // @ts-ignore
                    let data = ctx.callbackQuery.data;
                    if (data === 'back') {
                        ctx.wizard.selectStep(0);
                        ctx.answerCbQuery();
                        yield greeting(ctx);
                    }
                }
            }
            if (ctx.updateType === 'message') {
                let amount = 0;
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
                let amount_message = `<b>Поддержка проекта 💰</b> \n\n`;
                if (amount) {
                    const currentDate = new Date();
                    const futureDate = (currentDate.getTime() + 0.2 * 60 * 60 * 1000);
                    // @ts-ignore
                    let payment = yield new IPayment_1.Payment({
                        user_id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
                        amount: ctx.scene.session.amount,
                        expirationDateTime: futureDate
                    }).save();
                    console.log(payment);
                    let link = yield get_link_for_payment(ctx, ctx.scene.session.amount, payment._id.toString(), payment.expirationDateTime);
                    amount_message += `Счёт сформирован на сумму ${(0, format_money_1.default)(ctx.scene.session.amount)} ₽\n`;
                    yield ctx.reply(amount_message, {
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
                    });
                }
                else {
                    yield ctx.reply(message, extra);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
dashboard.action("home", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.scene.enter('home');
}));
dashboard.action("contact", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return ctx.answerCbQuery('Обратная связь');
}));
exports.default = dashboard;
