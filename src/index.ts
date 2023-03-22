import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { Telegraf, Scenes } from 'telegraf';
import { User } from './models/IUser';
import './bot/utlis/webhook';
import './database';

const app = express();
const stage = new Scenes.Stage();
app.use(bodyParser.json());

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(async (ctx) => {

    const user = new User({
        telegramId: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
    });

    try {
        await user.save();
        console.log(`User ${ctx.from.id} saved to database!`);
    } catch (err) {
        console.error(err);
    }

    ctx.reply('Hello!');
});

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { bot }