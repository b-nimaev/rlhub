import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { Telegraf, Scenes, session } from 'telegraf';
import './bot/utlis/webhook';
import './database';
import rlhubContext from './bot/models/rlhubContext';

// scenes
import home from './bot/views/home.scene';
import settings from './bot/views/settings.scene';

const app = express();
app.use(bodyParser.json());

const bot = new Telegraf<rlhubContext>(process.env.BOT_TOKEN!);
const stage = new Scenes.Stage<rlhubContext>([home, settings], { default: 'home' });
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