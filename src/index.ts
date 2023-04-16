import 'dotenv/config';
import { Telegraf, Scenes, session } from 'telegraf';
import rlhubContext from './bot/models/rlhubContext';
import set_webhook from './bot/utlis/webhook';
import './database';
import './app'

const fs = require('fs');
const openai = require('openai-api');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openaiClient = new openai(OPENAI_API_KEY);

const modelEngine = 'text-davinci-003';
const prompt = 'Дай мне 10 предложений на русском языке в виде массива. Предложения должны быть из литературных произведений.';

async function generateSentences(prompt: string, modelEngine: string, numSentences: number) {
    let sentences: any = [];
    while (sentences.length < numSentences) {
        const response = await openaiClient.complete({
            engine: modelEngine,
            prompt: prompt,
            maxTokens: 1024,
            n: 1,
            stop: null,
            temperature: 0.5,
        });
        console.log(response.data.choices[0])
        const text = response.data.choices[0].text.trim();
        const newSentences = text.split('. ');
        sentences = sentences.concat(newSentences);
    }
    return sentences.slice(0, numSentences);
}

// async function main() {
//     const sentences = await generateSentences(prompt, modelEngine, 1000);
//     fs.writeFileSync('sentences.txt', sentences.join('\n'));
// }

// main();
// scenes
import home from './bot/views/home.scene';
import sentences from './bot/views/sentences.scene';
import settings from './bot/views/settings.scene';
import dashboard from './bot/views/dashboard.scene';
import vocabular from './bot/views/vocabular.scene';
import moderation from './bot/views/moderation.scene';


const bot = new Telegraf<rlhubContext>(process.env.BOT_TOKEN!);
const stage: any = new Scenes.Stage<rlhubContext>([home, vocabular, sentences, dashboard, moderation, settings], { default: 'home' });

(async () => await set_webhook())();

bot.use(session())
bot.use(stage.middleware())

export { bot }