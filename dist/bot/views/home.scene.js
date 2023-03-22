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
const IUser_1 = require("../../models/IUser");
const handler = new telegraf_1.Composer();
const home = new telegraf_1.Scenes.WizardScene("home", handler);
home.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const user = new IUser_1.User({
        telegramId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
        firstName: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name,
        lastName: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.last_name,
        username: (_d = ctx.from) === null || _d === void 0 ? void 0 : _d.username,
    });
    try {
        console.log('123');
        yield user.save();
        console.log(`User ${(_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id} saved to database!`);
        ctx.scene.enter('settings');
    }
    catch (err) {
        console.error(err);
    }
    ctx.reply('Hello!');
}));
exports.default = home;
