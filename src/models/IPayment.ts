import mongoose, { Schema, model, ObjectId, Date, Document } from "mongoose";

interface IPayment extends Document {
    user_id: number,
    amount: number,
    expirationDateTime: Date
}

const Payment = model<IPayment>('Payment', new Schema({
    user_id: { type: Number, required: true },
    amount: { type: Number, required: true },
    expirationDateTime: {
        type: Date,
        expires: '10d',
        default: Date.now
    }
}));

export { Payment, IPayment }
