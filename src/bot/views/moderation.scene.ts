import { Composer, Scenes } from "telegraf";
import { ExtraReplyMessage, ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ISentence, Sentence } from "../../models/ISentence";
import rlhubContext from "../models/rlhubContext";
import { ObjectId } from "mongodb";

const handler = new Composer<rlhubContext>();
const moderation = new Scenes.WizardScene("moderation", handler,
    async (ctx: rlhubContext) => moderation_sentences_handler(ctx));

moderation.enter(async (ctx: rlhubContext) => await greeting(ctx));
async function greeting(ctx: rlhubContext) {

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
async function moderation_sentences(ctx: rlhubContext) {
    try {

        let message: string = `<b>Модерация — Предложения</b>`

        if (ctx.updateType === 'callback_query') {

            Sentence.findOne({
                accepted: "not view"
            }).then(async (document: ISentence | null) => {
                if (!document) {
                    await ctx.answerCbQuery('Предложений не найдено')
                    ctx.wizard.selectStep(0)
                    await greeting(ctx).catch(() => { ctx.answerCbQuery('Предложений не найдено') })
                } else {
                    
                    if (document._id) {
                        ctx.session.__scenes.moderation_sentence = document._id.toString()
                    }

                    let message = `<b>Модерация</b> \n\n`
                    let extra: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: '👍',
                                        callback_data: 'good'
                                    },
                                    {
                                        text: '👎',
                                        callback_data: 'bad'
                                    }
                                ],
                                [
                                    {
                                        text: 'Назад',
                                        callback_data: 'back'
                                    }
                                ]
                            ]
                        }
                    }

                    const options = {
                        weekday: 'short', // короткое название дня недели, например 'Пн'
                        year: 'numeric', // год, например '2023'
                        month: 'short', // короткое название месяца, например 'апр'
                        day: 'numeric', // число месяца, например '21'
                        hour: 'numeric', // часы, например '17'
                        minute: 'numeric', // минуты, например '14'
                        second: 'numeric', // секунды, например '33'
                    };

                    const formattedDate = document.createdAt.toLocaleDateString('ru-RU', options); // 'Пн, 21 апр. 2023'
                    // const formattedTime = document.createdAt.toLocaleTimeString('ru-RU', options); // '17:14:33'

                    message += `${document.text} \n`
                    message += `<pre>${formattedDate}</pre>`

                    await ctx.editMessageText(message, extra)
                    ctx.wizard.selectStep(1)
                }
            })

            ctx.answerCbQuery()

        }

    } catch (err) {

        console.log(err)

    }
}

async function updateSentence(ctx: rlhubContext, value: 'accepted' | 'declined' | 'not view') {
    await Sentence.findOneAndUpdate({ _id: new ObjectId(ctx.session.__scenes.moderation_sentence) }, {
        $set: {
            'accepted': value
        }
    }).then(async (res) => {
        if (res) {
            if (res.accepted === 'accepted') {
                ctx.answerCbQuery('Предложение принято ✅')
            } else if (res.accepted === 'declined') {
                ctx.answerCbQuery('Предложение отправлено на рассмотрение')
            }
        }
    }).catch(err => {
        console.log(err)
    })
    await moderation_sentences(ctx) 
}

async function moderation_sentences_handler(ctx: rlhubContext) {
    try {
        
        let update = ctx.updateType

        if (update === 'callback_query') {

            let data: 'back' | 'good' | 'bad' = ctx.update.callback_query.data
            
            if (data === 'back') {
                ctx.wizard.selectStep(0)
                await greeting(ctx)
            }

            if (data === 'good') {
                await updateSentence(ctx, 'accepted')
            }

            if (data === 'bad') {
                await updateSentence(ctx, 'declined')
            }

            ctx.answerCbQuery()

        }

    } catch (err) {
        console.log(err)
    }
}

handler.on("message", async (ctx) => await greeting(ctx))

handler.action("back", async (ctx) => {
    await ctx.answerCbQuery()
    return ctx.scene.enter("home")
})

export default moderation