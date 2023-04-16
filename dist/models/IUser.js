"use strict";
exports.__esModule = true;
exports.User = void 0;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    username: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    supported: { type: Number, required: true },
    translations: { type: [mongoose_1["default"].Schema.Types.ObjectId], required: false, "default": [] },
    voted_translations: { type: [mongoose_1["default"].Schema.Types.ObjectId], required: false, "default": [] },
    rating: { type: Number, required: true, "default": 1 },
    proposedProposals: { type: [String], required: true, "default": [] }
}, {
    timestamps: true
});
var User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
