"use strict";
exports.__esModule = true;
exports.Payment = void 0;
var mongoose_1 = require("mongoose");
var Payment = (0, mongoose_1.model)('Payment', new mongoose_1.Schema({
    user_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    expirationDateTime: {
        type: Date,
        expires: '10d',
        "default": Date.now
    }
}));
exports.Payment = Payment;
