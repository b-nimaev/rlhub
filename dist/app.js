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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const _1 = require(".");
const IUser_1 = require("./models/IUser");
const IPayment_1 = require("./models/IPayment");
const mongodb_1 = require("mongodb");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    _1.bot.handleUpdate(req.body, res);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get('/payment/success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    let billId = res.req.url.replace('/payment/success?billId=', '');
    let payment = yield IPayment_1.Payment.findOne({
        _id: new mongodb_1.ObjectId(billId)
    });
    let user = yield IUser_1.User.findOne({
        id: payment === null || payment === void 0 ? void 0 : payment.user_id
    });
    if (user && payment) {
        yield _1.bot.telegram.sendSticker(user === null || user === void 0 ? void 0 : user.id, 'CAACAgIAAxkBAAEIRdBkHZukHX1iJJVPMeQmZvfKXRgfDQACiRkAAkHrwEvwxgiNPD3Rai8E');
        yield _1.bot.telegram.sendMessage(user === null || user === void 0 ? void 0 : user.id, 'Спасибо за внесенный платеж!', {
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
        yield IUser_1.User.findOneAndUpdate({
            id: user.id
        }, {
            $set: {
                supported: user.supported + payment.amount
            }
        });
    }
}));
module.exports = app;
