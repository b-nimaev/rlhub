import mongoose, { Schema, model, ObjectId } from "mongoose";
import { User } from "telegraf/typings/core/types/typegram";

interface IUser extends User {
    translations: ObjectId[]; // добавлено поле "переводы"
    voted_translations: ObjectId[]; // добавлено поле "голосование за переводы"
    rating: number; // добавлено поле "рейтинг",
    supported: number;
    proposedProposals: string[];
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    id: { type: Number, required: true },
    username: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    supported: { type: Number, required: true },
    translations: { type: [mongoose.Schema.Types.ObjectId], required: false, default: [] }, // добавлено поле "переводы"
    voted_translations: { type: [mongoose.Schema.Types.ObjectId], required: false, default: [] }, // добавлено поле "голосование за переводы"
    rating: { type: Number, required: true, default: 1 }, // добавлено поле "рейтинг",
    proposedProposals: { type: [String], required: true, default: [] }
}, {
    timestamps: true
});

const User = model<IUser>('User', userSchema);

export { User, IUser }
