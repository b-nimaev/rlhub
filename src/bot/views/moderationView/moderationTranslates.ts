import { ObjectId } from "mongodb"
import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import { Translation, Sentence, voteModel, translation } from "../../../models/ISentence"
import rlhubContext from "../../models/rlhubContext"
import { response } from "express"

export default async function moderation_translates(ctx: rlhubContext) {
    try {

        await render_vote_sentence(ctx)

    } catch (err) {

        console.log(err)

    }
}

export async function render_vote_sentence(ctx: rlhubContext) {
    try {

        // получаем перевод и предложение которое переведено
        let translation: translation = await Translation.aggregate([
            { $addFields: { votesCount: { $size: "$votes" } } },
            { $sort: { votesCount: 1 } },
            { $limit: 1 }
        ]).then(async (response) => {
            return response[0]
        }).catch(async (err) => {
            console.error(err)
        })

        if (!translation) {
            if (ctx.updateType === 'callback_query') {
                return ctx.answerCbQuery('Предложений не найдено')
            }
        } 

        let sentence_russian = await Sentence.findOne({
            _id: new ObjectId(translation?.sentence_russian)
        })

        // если перевод найден сохраним его в контекст
        if (translation) {
            // @ts-ignore
            ctx.scene.session.current_translation_for_vote = translation._id
        }

        // текст
        let message = `<b>Модерация / Голосование</b>\n\n`
        message += `Предложение на русском языке <pre>${sentence_russian?.text}</pre> \n`
        // message += `Количество переводов: ${sentence_russian?.translations.length}\n\n`
        message += `Проголосуйте за следующий перевод \n`
        message += `<pre>${translation?.translate_text}</pre>`
        let statistic = {
            plus: <any>[],
            minus: <any>[]
        }

        if (translation) {
            if (translation.votes) {
                if (translation.votes.length) {


                    for (let i = 0; i < translation.votes.length; i++) {

                        const voteID = translation.votes[i]
                        const vote = await voteModel.findOne({ _id: voteID })

                        if (vote?.vote) {
                            statistic.plus.push(vote)
                        } else {
                            statistic.minus.push(vote)
                        }

                    }

                    console.log(statistic.plus.length)
                    console.log(statistic.minus.length)

                    // message += `\n\nКоличество голосов: <pre>15+, 2-</pre>`

                }
            }
        }

        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `👍 ${statistic.plus.length}`,
                            callback_data: 'good'
                        },
                        {
                            text: `👎 ${statistic.minus.length}`,
                            callback_data: 'bad'
                        }
                    ],
                    [
                        {
                            text: 'Предложить перевод',
                            callback_data: 'addTranslate'
                        }
                    ],
                    [
                        {
                            text: 'Пропустить',
                            callback_data: 'skip'
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
        if (ctx.updateType === 'callback_query') {
            ctx.editMessageText(message, extra)
            ctx.answerCbQuery()
        } else {
            ctx.reply(message, extra)
        }
        ctx.wizard.selectStep(2)
    } catch (err) {
        console.log(err)
    }
}