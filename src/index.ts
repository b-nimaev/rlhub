import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { Telegraf } from 'telegraf';
import { set_webhook } from './bot/utlis/webhook';

const app = express();
app.use(bodyParser.json());

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => {
    ctx.reply('Hello!');
});

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

set_webhook()

export { bot }