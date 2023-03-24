import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { Telegraf, Scenes, session } from 'telegraf';
import rlhubContext from './bot/models/rlhubContext';
import './bot/utlis/webhook';
import './database';

// scenes
import home from './bot/views/home.scene';
import sentences from './bot/views/sentences.scene';
import settings from './bot/views/settings.scene';
import dashboard from './bot/views/dashboard.scene';
import vocabular from './bot/views/vocabular.scene';
import moderation from './bot/views/moderation.scene';

const app = express();
app.use(bodyParser.json());

const bot = new Telegraf<rlhubContext>(process.env.BOT_TOKEN!);
const stage = new Scenes.Stage<rlhubContext>([home, vocabular, sentences, dashboard, moderation, settings], { default: 'home' });

bot.use(session())
bot.use(stage.middleware())

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { bot }