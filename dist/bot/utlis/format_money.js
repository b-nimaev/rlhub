"use strict";
exports.__esModule = true;
function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}
exports["default"] = formatMoney;
