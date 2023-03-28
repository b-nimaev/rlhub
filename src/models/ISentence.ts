import mongoose, { Schema, Document, ObjectId, model } from "mongoose";

interface vote {
    user_id: number,
    vote: boolean
}

interface translation {
    sentence_russian: string;
    translate_text: string;
    author: number;
    votes: vote[];
}

const translationSchema: Schema<translation> = new mongoose.Schema({
    sentence_russian: { type: String, required: true },
    translate_text: { type: String, required: true },
    author: { type: Number, required: true },
    votes: {
        type: [{
            user_id: { type: Number, required: true },
            vote: { type: Boolean, required: true }
        }], default: []
    },
})

const Translation = model<translation>("Translation", translationSchema);

interface ISentence {
    text: string;
    author: number;
    accepted: 'accepted' | 'declined' | 'not view';
    translations: string[];
    skipped_by: number[];
}

const Sentence = model<ISentence>("Sentence", new Schema({
    text: { type: String, required: true },
    author: { type: Number, required: true },
    translations: [{ type: String, required: true }],
    skipped_by: [{ type: Number, required: true }],
    accepted: { type: String, required: true }
}, {
    timestamps: true
}));

export { Sentence, Translation, ISentence, translation };