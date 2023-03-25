import 'dotenv/config';
import { Telegraf, Scenes, session } from 'telegraf';
import rlhubContext from './bot/models/rlhubContext';
import set_webhook from './bot/utlis/webhook';
import './database';
import './app'

// scenes
import home from './bot/views/home.scene';
import sentences from './bot/views/sentences.scene';
import settings from './bot/views/settings.scene';
import dashboard from './bot/views/dashboard.scene';
import vocabular from './bot/views/vocabular.scene';
import moderation from './bot/views/moderation.scene';


const bot = new Telegraf<rlhubContext>(process.env.BOT_TOKEN!);
const stage = new Scenes.Stage<rlhubContext>([home, vocabular, sentences, dashboard, moderation, settings], { default: 'home' });

(async () => await set_webhook())();

bot.use(session())
bot.use(stage.middleware())

export { bot }