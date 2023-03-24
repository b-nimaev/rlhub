"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const Payment = (0, mongoose_1.model)('Payment', new mongoose_1.Schema({
    user_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    expirationDateTime: {
        type: Date,
        expires: '10d',
        default: Date.now
    }
}));
exports.Payment = Payment;
