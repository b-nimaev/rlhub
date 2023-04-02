import { ISentence, Sentence } from "../../../models/ISentence"
import { User } from "../../../models/IUser"
import rlhubContext from "../../models/rlhubContext"
import greeting from "./greeting"

export default async function add_sentences(ctx: rlhubContext) {
    ctx.answerCbQuery()
    ctx.wizard.selectStep(2)
    let message = `<b>Добавление перевода — Предложения</b>\n\n`
    message += `Отправьте список предложений на русском которые хотите добавить в базу данных для их перевода в дальнейшем`
    await ctx.editMessageText(message, {
        parse_mode: 'HTML', reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Назад',
                        callback_data: 'back'
                    }
                ]
            ]
        }
    })
}

async function add_sentences_handler(ctx: rlhubContext) {

    if (ctx.from) {
        try {

            if (ctx.updateType === 'callback_query') {
                if (ctx.callbackQuery) {

                    // @ts-ignore
                    if (ctx.callbackQuery.data) {

                        // @ts-ignore
                        let data: 'send_sentences' | 'back' = ctx.callbackQuery.data

                        // сохранение предложенных предложений
                        if (data === 'send_sentences') {

                            for (let i = 0; i < ctx.session.sentences.length; i++) {

                                let sentence: ISentence = {
                                    text: ctx.session.sentences[i],
                                    author: ctx.from.id,
                                    translations: [],
                                    accepted: 'not view',
                                    skipped_by: [],
                                    active_translator: [],
                                }

                                new Sentence(sentence).save().then(async (data) => {
                                    let object_id = data._id

                                    await User.findOneAndUpdate({ id: ctx.from?.id }, {
                                        $push: {
                                            "proposedProposals": object_id
                                        }
                                    })

                                })

                            }

                            await ctx.answerCbQuery(`${ctx.session.sentences} отправлены на проверку, спасибо!`)
                            ctx.wizard.selectStep(0)
                            await greeting(ctx)
                        }

                        if (data === 'back') {
                            ctx.wizard.selectStep(0)
                            await ctx.answerCbQuery()
                            return greeting(ctx)
                        }
                    }
                }

            } else if (ctx.updateType === 'message') {

                // @ts-ignore
                if (ctx.message.text) {

                    // @ts-ignore
                    let text = ctx.message.text

                    let user_id: number = ctx.from.id

                    let sentence: ISentence = {
                        text: text.toLocaleLowerCase(),
                        author: user_id,
                        translations: [],
                        accepted: 'not view',
                        skipped_by: [],
                        active_translator: [],
                    }

                    let message: string = ``

                    if (sentence.text.indexOf('+;') !== -1) {
                        let splitted = sentence.text.split('+;')
                        let arr: string[] = []
                        for (let i = 0; i < splitted.length; i++) {
                            arr.push(splitted[i].trimEnd().trimStart())
                        }

                        ctx.session.sentences = arr

                        for (let i = 0; i < splitted.length; i++) {
                            message += `${i + 1}) ${splitted[i].trimStart().trimEnd()}\n`
                        }
                    } else {
                        ctx.session.sentences = [text]
                        message += text
                    }

                    await ctx.reply(message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Сохранить',
                                        callback_data: 'send_sentences'
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
                    })

                } else {
                    await ctx.reply("Нужно отправить в текстовом виде")
                }

            }

        } catch (err) {
            ctx.wizard.selectStep(0)
            await greeting(ctx)
        }
    }

}

export { add_sentences_handler }