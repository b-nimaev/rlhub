import mongoose, { Schema, Document, ObjectId, model } from "mongoose";

interface vote {
    user_id: ObjectId,
    translation_id: ObjectId,
    vote: boolean
}

const voteSchema: Schema<vote> = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    translation_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    vote: { type: Boolean, required: true }
}, {
    timestamps: true
})

export const voteModel = model<vote>("votes", voteSchema)

interface translation {
    sentence_russian: string;
    translate_text: string;
    author: number;
    votes?: ObjectId[];
    skipped_by?: ObjectId[]
}

const translationSchema: Schema<translation> = new mongoose.Schema({
    sentence_russian: { type: String, required: true },
    translate_text: { type: String, required: true },
    author: { type: Number, required: true },
    votes: {  type: [mongoose.Schema.Types.ObjectId], required: false },
    skipped_by: { type: [mongoose.Schema.Types.ObjectId], required: false }
})

const Translation = model<translation>("Translation", translationSchema);

interface active_translator {
    _id?: ObjectId;
    user_id: ObjectId;
}

const ActiveTranslator = model<active_translator>("Active_translator", new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true }
}, {
    timestamps: {
        createdAt: true
    },
    expireAfterSeconds: 5
}))

interface ISentence {
    createdAt?: any;
    text: string;
    author: number;
    accepted: 'accepted' | 'declined' | 'not view';
    translations: string[];
    skipped_by: number[];
    active_translator: string[];
    _id?: ObjectId
}

const Sentence = model<ISentence>("Sentence", new Schema({
    text: { type: String, required: true },
    author: { type: Number, required: true },
    translations: [{ type: String, required: true }],
    skipped_by: [{ type: Number, required: true }],
    accepted: { type: String, required: true },
    active_translator: [{ type: String, required: true }]
}, {
    timestamps: true
}));

export { Sentence, Translation, ISentence, translation, active_translator, ActiveTranslator };