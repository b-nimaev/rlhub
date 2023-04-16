"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var MONGODB_URI = "".concat(process.env.MONGODB_URI) || 'mongodb://localhost:27017/rlhub';
mongoose_1["default"].connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose_1["default"].connection.on('connected', function () {
    console.log('Connected to MongoDB!');
});
module.exports = mongoose_1["default"].connection;
