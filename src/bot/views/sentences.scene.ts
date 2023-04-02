import { Composer, Scenes } from "telegraf";
import rlhubContext from "../models/rlhubContext";
import greeting from "./sentencesView/greeting";
import my_sentences, { my_sentences_handler } from "./sentencesView/mySentences";
import translate_sentences, { translate_sentences_handler } from "./sentencesView/translateSentences";
import { add_translate_to_sentences_hander } from "./sentencesView/render_sft";
import add_sentences, { add_sentences_handler } from "./sentencesView/addSentences";

const handler = new Composer<rlhubContext>();
const sentences = new Scenes.WizardScene("sentences", handler,
    async (ctx: rlhubContext) => await my_sentences_handler(ctx),
    async (ctx: rlhubContext) => await add_sentences_handler(ctx),
    async (ctx: rlhubContext) => await translate_sentences_handler(ctx),
    async (ctx: rlhubContext) => await add_translate_to_sentences_hander(ctx))


sentences.enter(async (ctx: rlhubContext) => await greeting(ctx));
sentences.action('my_sentences', async (ctx) => await my_sentences(ctx))
sentences.action("add_sentence", async (ctx: rlhubContext) => await add_sentences(ctx))
sentences.action("translate_sentences", async (ctx: rlhubContext) => await translate_sentences(ctx))
sentences.action("home", async (ctx) => {
    ctx.answerCbQuery()
    ctx.scene.enter('home')
})

// обработка входящих на сцене
handler.on("message", async (ctx) => await greeting(ctx))

export default sentences