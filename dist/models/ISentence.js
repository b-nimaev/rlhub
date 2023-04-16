"use strict";
exports.__esModule = true;
exports.ActiveTranslator = exports.Translation = exports.Sentence = void 0;
var mongoose_1 = require("mongoose");
var translationSchema = new mongoose_1["default"].Schema({
    sentence_russian: { type: String, required: true },
    translate_text: { type: String, required: true },
    author: { type: Number, required: true },
    votes: {
        type: [{
                user_id: { type: Number, required: true },
                vote: { type: Boolean, required: true }
            }], "default": []
    }
});
var Translation = (0, mongoose_1.model)("Translation", translationSchema);
exports.Translation = Translation;
var ActiveTranslator = (0, mongoose_1.model)("Active_translator", new mongoose_1.Schema({
    user_id: { type: mongoose_1["default"].Schema.Types.ObjectId, required: true }
}, {
    timestamps: {
        createdAt: true
    },
    expireAfterSeconds: 5
}));
exports.ActiveTranslator = ActiveTranslator;
var Sentence = (0, mongoose_1.model)("Sentence", new mongoose_1.Schema({
    text: { type: String, required: true },
    author: { type: Number, required: true },
    translations: [{ type: String, required: true }],
    skipped_by: [{ type: Number, required: true }],
    accepted: { type: String, required: true },
    active_translator: [{ type: String, required: true }]
}, {
    timestamps: true
}));
exports.Sentence = Sentence;
