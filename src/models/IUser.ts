import { Model, Schema } from "mongoose";
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    firstName: String,
    lastName: String,
    username: String,
});

const User: Model<Schema> = mongoose.model('User', userSchema);

export { User }
