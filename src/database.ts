import mongoose from 'mongoose';

const MONGODB_URI = `mongodb://${process.env.MONGODB_URI}:27017/rlhub` || 'mongodb://localhost:27017/rlhub';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

module.exports = mongoose.connection;
