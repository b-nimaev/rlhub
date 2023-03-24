"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}
exports.default = formatMoney;
