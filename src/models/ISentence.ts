import mongoose, { Schema, Document, ObjectId, model } from "mongoose";

interface vote {
    user_id: number,
    vote: boolean
}

interface ISentence {
    text: string;
    author: number;
    votes: { user_id: number; vote: boolean; }[];
    accepted: 'accepted' | 'declined' | 'not view';
}

const sentenceSchema: Schema<ISentence> = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: Number, required: true },
    votes: { type: [{
        user_id: { type: Number, required: true },
        vote: { type: Boolean, required: true }
    }], default: [] },
    accepted: { type: String, required: true }
}, {
    timestamps: true
});

const Sentence = model<ISentence>("Sentence", sentenceSchema);

export { Sentence, ISentence };