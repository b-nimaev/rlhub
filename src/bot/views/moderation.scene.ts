import { Composer, Scenes } from "telegraf";
import { ExtraReplyMessage, ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ISentence, Sentence } from "../../models/ISentence";
import rlhubContext from "../models/rlhubContext";

const handler = new Composer<rlhubContext>();
const moderation = new Scenes.WizardScene("moderation", handler);

moderation.enter(async (ctx: rlhubContext) => await greeting (ctx));
async function greeting (ctx: rlhubContext) {

    try {

        let message: string = `<b>Модерация</b>\n\n`
        const extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Предложения',
                        callback_data: 'moderation_sentences'
                    }],
                    [{
                        text: 'Переводы',
                        callback_data: 'moderation_translates'
                    }
                    ],
                    [{
                        text: 'Назад',
                        callback_data: 'back'
                    }]
                ]
            }
        }

        message += `Выберите раздел чтобы приступить`

        ctx.updateType === 'message' ? await ctx.reply(message, extra) : false
        ctx.updateType === 'callback_query' ? await ctx.editMessageText(message, extra) : false

    } catch (err) {

        console.error(err);

    }

}

moderation.action("moderation_translates", async (ctx) => await moderation_translates(ctx))
async function moderation_translates(ctx: rlhubContext) {
    try {

        if (ctx.updateType === 'callback_query') {

            ctx.answerCbQuery()

        }

    } catch (err) {
        
        console.log(err)

    }
}
async function moderation_translates_handler(ctx: rlhubContext) {
// 👍👎
}

moderation.action("moderation_sentences", async (ctx) => await moderation_sentences(ctx))
async function moderation_sentences (ctx: rlhubContext) {
    try {

        let message: string = `<b>Модерация — Предложения</b>`
        
        if (ctx.updateType === 'callback_query') {
            
            Sentence.find({
                accepted: "not view"
            }).then(async (documents) => {
                if (documents) {
                    if (documents.length) {

                        

                    }
                }
            })

            ctx.answerCbQuery()

        }

    } catch (err) {

        console.log(err)

    }
}
async function moderation_sentences_handler(ctx: rlhubContext) {

}

handler.on("message", async (ctx) => await greeting (ctx))

moderation.action("back", async (ctx) => {
    await ctx.answerCbQuery()
    return ctx.scene.enter("home")
})

export default moderation