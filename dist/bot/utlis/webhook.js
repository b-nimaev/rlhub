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
exports.set_webhook = void 0;
const __1 = require("../..");
function set_webhook() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.MODE === 'production') {
            __1.bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`);
        }
        else {
            yield fetch('http://localhost:4040/api/tunnels')
                .then((res) => res.json())
                .then((json) => json.tunnels.find(tunnel => tunnel.proto === 'https'))
                .then((secureTunnel) => __1.bot.telegram.setWebhook(`${secureTunnel.public_url}/bot${process.env.BOT_TOKEN}`))
                .then((status) => __awaiter(this, void 0, void 0, function* () {
                console.log(status);
            }));
        }
    });
}
exports.set_webhook = set_webhook;
